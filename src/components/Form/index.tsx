import { ArrowLeft } from "phosphor-react-native";
import React from "react";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { Button } from "../Button";
import { ScreenshotButton } from "../ScreenshotButton/Index";
import { FeedbackType } from "../Widget";
import { captureScreen } from "react-native-view-shot";

import * as FileSystem from "expo-file-system";

import { styles } from "./styles";
import { api } from "../../libs/api";

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCancelled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCancelled,
  onFeedbackSent,
}: Props) {
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((error) => console.log(error));
  }

  function handleRemoveScreenshot() {
    setScreenshot(null);
  }

  async function handleSubmitFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readAsStringAsync(screenshot, { encoding: "base64" }));

    try {
      await api.post("/feedbacks", {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment,
      });
      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCancelled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image style={styles.image} source={feedbackTypeInfo.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        autoCorrect={false}
        multiline
        style={styles.input}
        placeholder="Tell us in details whats happening..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          onRemoveShot={handleRemoveScreenshot}
          onTakeShot={handleScreenshot}
          screenshot={screenshot}
        />

        <Button isLoading={isSendingFeedback} onPress={handleSubmitFeedback} />
      </View>
    </View>
  );
}
