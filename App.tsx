/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import ReactNativePickerModule, {PickerRef} from 'react-native-picker-module';
import Entry from './src/components/Entry';

export type ChatHistoryType = {
  role: string;
  parts: {
    text: string;
  }[];
}[];

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const pickerRef = useRef<PickerRef>(null);
  const [model, setModel] = useState('Gemini');
  const [chatHistory, setChatHistory] = useState<ChatHistoryType>([]);

  return (
    <>
      <SafeAreaView className="bg-white text-black dark:bg-black dark:text-white">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <TouchableOpacity
          className="h-[10%] items-center justify-center shadow-lg"
          onPress={() => pickerRef.current?.show()}>
          <Text className="text-black dark:text-white text-base">Select a model: {model}</Text>
        </TouchableOpacity>
        <View className="h-[90%]">
          <Entry
            modelName={model}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </View>
      </SafeAreaView>
      <ReactNativePickerModule
        ref={pickerRef}
        value={model}
        title={'Select a model'}
        items={['Gemma - Tuned', 'Gemma - RAG', 'Gemini', 'Gemini (Tuned)', 'Gemini (RAG)']}
        selectedColor="#E0E0E0"
        tintColor="#000000"
        onValueChange={value => {
          setChatHistory([]);
          setModel(value);
        }}
      />
    </>
  );
}

export default App;
