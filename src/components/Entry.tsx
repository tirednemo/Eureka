import {GoogleGenerativeAI} from '@google/generative-ai';
import {GEMINI_API_KEY} from "@env";
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

type MessageProps = PropsWithChildren<{
  role: string;
  content: string;
  // timestamp: string;
}>;

function BotMessage({children, content}: MessageProps): React.JSX.Element {
  return (
    <View className="flex-row justify-start mt-5 mb-5 gap-2">
      <BotImage />
      {content === '' ? (
        <View className="w-1/2 p-2 bg-white border-dashed border-2 border-red-400">
          <Text className="text-lg text-black dark:text-white">
            Please try again. Gemini is acting up.
          </Text>
        </View>
      ) : (
        <View className="w-1/2 p-2 bg-white border-dashed border-2 border-primary-orange">
          <Text className="text-lg text-black dark:text-white">{content}</Text>
        </View>
      )}
    </View>
  );
}

function UserMessage({children, content}: MessageProps): React.JSX.Element {
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [question, setQuestion] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messages, setMessages] = useState([
    {
      role: 'user',
      parts: [{text: 'Hello.'}],
    },
    {
      role: 'model',
      parts: [{text: 'Hi! What would you like to know?'}],
    },
  ]);
  const model = genAI.getGenerativeModel({model: 'gemini-pro'});
  const chat = model.startChat({
    history: messages,
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const sendMessage = async () => {
    console.log('History:', JSON.stringify(messages, null, 2));
    console.log('You asked:', question);
    chat
      .sendMessage(question)
      .then(result => {
        const response = result.response;
        if (response === null) {
          return;
        } else {
          console.log('Gemini replied:', response.text());
          setQuestion('');
          setIsDisabled(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
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
            {messages
              .slice(1)
              .map((message, index) =>
                message.role === 'model' ? (
                  <BotMessage
                    key={index}
                    role="model"
                    content={message.parts[0].text}
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
            className="w-full p-2 border-dashed border-2 border-black"
            placeholder="Ask something..."
            defaultValue={question}
            onChangeText={newText => setQuestion(newText)}
            editable={!isDisabled}
          />
          <TouchableOpacity
            onPress={() => {
              setIsDisabled(true);
              sendMessage();
            }}
            disabled={isDisabled}>
            <Image
              src="https://img.icons8.com/ios/50/sent--v1.png"
              className="w-8 h-8"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Entry;
