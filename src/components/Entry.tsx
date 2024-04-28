import React, {useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {ChatHistoryType} from '../../App';
import {askGemini, askGemma} from '../actions/api';
import BotImage from '../assets/images/bot.svg';
import UserImage from '../assets/images/user.svg';

type MessageType = {
  role: string;
  content: string;
  error?: string;
};

function BotMessage({content, error}: MessageType): React.JSX.Element {
  return (
    <View className="flex-row justify-start mt-5 mb-5 gap-2">
      <BotImage />
      {error ? (
        <View className="w-2/3 p-2 bg-white dark:bg-black border-dashed border-2 border-red-400">
          <Text className="text-lg text-black dark:text-white">{error}</Text>
        </View>
      ) : (
        <View className="w-2/3 p-2 bg-white dark:bg-black border-dashed border-2 border-primary-orange">
          <Text className="text-lg text-black dark:text-white">{content}</Text>
        </View>
      )}
    </View>
  );
}

function UserMessage({content}: MessageType): React.JSX.Element {
  return (
    <View className="flex-row justify-end mb-5 gap-2">
      <View className="w-2/3 p-2 bg-white dark:bg-black border-dashed border-2 border-primary-cyan">
        <Text className="text-lg text-black dark:text-white">{content}</Text>
      </View>
      <UserImage />
    </View>
  );
}

type EntryProps = {
  modelName: string;
  chatHistory: ChatHistoryType;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistoryType>>;
};

const Entry = ({modelName, chatHistory, setChatHistory}: EntryProps) => {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');

  const [isDisabled, setIsDisabled] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const askQuestion = async () => {
    try {
      // console.log('History:', JSON.stringify(chatHistory, null, 2));
      // console.log('You asked:', question);
      const answer =
        modelName === 'Gemini'
          ? await askGemini({query: question, history: chatHistory})
          : await askGemma({query: question});

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
      setError(`Please try again. ${modelName} is acting up.`);
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
            <BotMessage role="model" content={'Hi! I am Eureka.'} />
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
            className={`w-full p-2 border-dashed border-2 text-black placeholder-black dark:text-white dark:placeholder-white ${
              isDisabled ? 'border-gray-300' : 'border-black dark:border-white'
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
              src={`${
                useColorScheme() === 'dark'
                  ? 'https://img.icons8.com/ios/50/FFFFFF/sent--v1.png'
                  : 'https://img.icons8.com/ios/50/000000/sent--v1.png'
              }`}
              className={`w-8 h-8 ${isDisabled && 'opacity-30'}`}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Entry;
