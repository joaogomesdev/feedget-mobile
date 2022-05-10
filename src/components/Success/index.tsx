import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import successImg from "../../assets/success.png";
import { Copyright } from "../Copyright";
import { styles } from "./styles";

interface Props {
  onSendAnotherFeedback: () => void;
}

export function Success({ onSendAnotherFeedback }: Props) {
  return (
    <View style={styles.container}>
      <Image source={successImg} style={styles.image} />

      <Text style={styles.title}>Thanks for the feedback!</Text>

      <TouchableOpacity style={styles.button} onPress={onSendAnotherFeedback}>
        <Text style={styles.buttonTitle}>Send another!</Text>
      </TouchableOpacity>

      <Copyright />
    </View>
  );
}
