import React from 'react';
import {SafeAreaView} from 'react-native';
import {Auth} from 'aws-amplify';
import Button from '../../Component/Button';

const MenuScreen = () => {
  const onLogout = () => {
    Auth.signOut();
  };

  return (
    <SafeAreaView>
      <Button text="Sign out" onPress={onLogout} />
    </SafeAreaView>
  );
};

export default MenuScreen;