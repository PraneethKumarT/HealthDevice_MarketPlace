
import {View, StatusBar, useColorScheme} from 'react-native';
import Router from './src/router/index.js';
import React from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <StripeProvider publishableKey="pk_live_51NaLA4SIEz1BywLamBdAUBjXqN1rrfxcGAtsBkvhARVpe6ZBOHk59bXIzn7OIqP0fMF1I28086S4vkjFxRCWRmdt00qIWxeqwr">
        <Router />
      </StripeProvider>
    </View>
  );
};

export default withAuthenticator(App);