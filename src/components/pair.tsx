import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const PairDialog: React.FC = () => {
  useEffect(() => {
    console.log('pair dialog');
  }, []);

  return (
    <View className=''>
      <Text className=''>Pair dialog</Text>
    </View>
  );
};

export default PairDialog;
