import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';

type CatProps = {
  color: string;
};

const Cat = (props: CatProps) => {
  const [text, setText] = useState('');
  const [isHungry, setIsHungry] = useState(true);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Food[]>([]);

  type Food = {
    id: string;
    name: string;
    type: string;
  };

  type SectionProps = PropsWithChildren<{
    title: string;
  }>;

  function Section({children, title}: SectionProps): React.JSX.Element {
    return (
      <View className="mt-8 px-2">
        <Text className="text-2xl text-black dark:text-white">{title}</Text>
        <Text className="mt-2 text-lg text-black dark:text-white">
          {children}
        </Text>
      </View>
    );
  }

  const getFullName = (
    firstName: string,
    secondName: string,
    thirdName: string,
  ) => {
    return firstName + ' ' + secondName + ' ' + thirdName;
  };

  const getFoods = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/foods');
      const foods = await response.json();
      setData(foods);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFoods();
  }, []);

  return (
    <View className="bg-white dark:bg-black p-8">
      <Text className="text-red-900">
        Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}. I am a {props.color!}{' '}
        cat!
      </Text>
      <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
        }}
        className="w-48 h-48"
      />
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={
          isHungry
            ? 'I am hungry. Pour me some milk, please!'
            : 'I am full. Thank you!'
        }
      />
      <TextInput
        className="h-12 border border-gray-500 mt-10"
        placeholder="You can type here to talk to me!"
        onChangeText={newText => setText(newText)}
      />
      {text && <Text className="text-black text-lg">You said {text}</Text>}

      <Text className="text-2xl text-black dark:text-white text-center font-bold mt-10">
        How to pet me
      </Text>
      <Section title="Step One">
        The obvious. To pet me, you need to be in the same room as me.
      </Section>
      <Section title="Step Two">Just kidding. Swipe your finger on me.</Section>
      <Section title="Step Three">
        If I prrr, keep doing. If I hiss at you, I am not in the mood.
      </Section>

      <View className="flex mt-10">
        <Text className="text-2xl text-black dark:text-white text-center font-bold">
          Things I like to eat
        </Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            // data={[
            //   {key: 'Fish'},
            //   {key: 'Chicken'},
            //   {key: 'Cat food'},
            //   {key: 'More cat food'},
            //   {key: 'Milk'},
            //   {key: "Owner's food"},
            //   {key: "Mice even if you don't like"},
            // ]}
            data={data}
            keyExtractor={({id}) => id}
            renderItem={({item}) => (
              <Text className="p-2 h-10 text-lg">
                {item.name}, {item.type}
              </Text>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Cat;
