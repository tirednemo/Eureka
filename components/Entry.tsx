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

type MessageProps = PropsWithChildren<{
  role: string;
  content: string;
  // timestamp: string;
}>;

function BotMessage({children, content}: MessageProps): React.JSX.Element {
  return (
    <View className="flex-row justify-start mt-5">
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
    <View className="flex-row justify-end mt-5">
      <View className="w-1/2 p-2 bg-white border-dashed border-2 border-primary-cyann">
        <Text className="text-lg text-black dark:text-white">{content}</Text>
      </View>
    </View>
  );
}

const Entry = () => {
  const genAI = new GoogleGenerativeAI('API_KEY');
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
    console.log('You asked:', question);
    chat
      .sendMessage(question)
      .then(result => {
        const response = result.response;
        if (response === null) {
          return;
        } else {
          console.log('Gemini replied:', response.text());
          setMessages(prevMessages => [
            ...prevMessages,
            {role: 'model', parts: [{text: response.text()}]},
          ]);
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
      <View className="h-screen bg-white text-lg">
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }
          contentInsetAdjustmentBehavior="automatic">
          <View className="p-10 justify-between">
            <View>
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
          </View>
        </ScrollView>
        <View className="flex flex-row items-center justify-center gap-2 p-16 h-fit">
          <TextInput
            className="w-full p-2 border-dashed border-2 border-primary-cyan"
            placeholder="Type a message..."
            defaultValue={question}
            onChangeText={newText => setQuestion(newText)}
            editable={!isDisabled}
          />
          <TouchableOpacity
            onPress={() => {
              setMessages(prevMessages => [
                ...prevMessages,
                {role: 'user', parts: [{text: question}]},
              ]);
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
