import {GEMINI_API_KEY} from '@env';
import {GoogleGenerativeAI} from '@google/generative-ai';
import React, {PropsWithChildren, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BotImage from '../assets/images/bot.svg';
import UserImage from '../assets/images/user.svg';

type MessageType = {
  role: string;
  content: string;
  error?: string;
};

type ChatHistoryType = {
  role: string;
  parts: {
    text: string;
  }[];
}[];

function BotMessage({content, error}: MessageType): React.JSX.Element {
  return (
    <View className="flex-row justify-start mt-5 mb-5 gap-2">
      <BotImage />
      {error ? (
        <View className="w-1/2 p-2 bg-white border-dashed border-2 border-red-400">
          <Text className="text-lg text-black dark:text-white">{error}</Text>
        </View>
      ) : (
        <View className="w-1/2 p-2 bg-white border-dashed border-2 border-primary-orange">
          <Text className="text-lg text-black dark:text-white">{content}</Text>
        </View>
      )}
    </View>
  );
}

function UserMessage({content}: MessageType): React.JSX.Element {
  return (
    <View className="flex-row justify-end mb-5 gap-2">
      <View className="w-1/2 p-2 bg-white border-dashed border-2 border-primary-cyan">
        <Text className="text-lg text-black dark:text-white">{content}</Text>
      </View>
      <UserImage />
    </View>
  );
}

const Entry = ({modelName}: {modelName: string}) => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const askQuestion = async () => {
    try {
      // console.log('History:', JSON.stringify(chatHistory, null, 2));
      // console.log('You asked:', question);

      const model = genAI.getGenerativeModel({model: 'gemini-pro'});

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(question);
      const response = result.response;
      const answer = response.text();
      // console.log('Gemini replied:', answer);

      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        {
          role: 'model',
          parts: [{text: answer}],
        },
      ]);
      setQuestion('');
      setIsDisabled(false);
    } catch (error) {
      console.error(error);
      setError('Please try again. Gemini is acting up.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <View className="h-full text-lg">
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }
          contentInsetAdjustmentBehavior="automatic">
          <View className="p-5">
            <BotMessage role="model" content={'Hi! Ask me anything!'} />
            {chatHistory.map((message, index) =>
              message.role === 'model' ? (
                <BotMessage
                  key={index}
                  role="model"
                  content={message.parts[0].text}
                  error={error}
                />
              ) : (
                <UserMessage
                  key={index}
                  role="user"
                  content={message.parts[0].text}
                />
              ),
            )}
          </View>
        </ScrollView>
        <View className="flex flex-row items-center justify-center gap-2 p-14">
          <TextInput
            className={`w-full p-2 border-dashed border-2 ${
              isDisabled ? 'border-gray-300' : 'border-black'
            }`}
            placeholder="Ask something..."
            defaultValue={question}
            onChangeText={newText => setQuestion(newText)}
            editable={!isDisabled}
          />
          <TouchableOpacity
            onPress={() => {
              setChatHistory(oldChatHistory => [
                ...oldChatHistory,
                {
                  role: 'user',
                  parts: [{text: question}],
                },
              ]);
              setIsDisabled(true);
              askQuestion();
            }}
            disabled={isDisabled}>
            <Image
              src="https://img.icons8.com/ios/50/sent--v1.png"
              className={`w-8 h-8 ${isDisabled && 'opacity-30'}`}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Entry;
