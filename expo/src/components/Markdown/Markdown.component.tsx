import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import MarkdownRenderer, { RenderRules } from "react-native-markdown-display";
import { montserrat, montserratBold } from "../../root.theme";

const rules: RenderRules = {
  heading1: (node, children) => (
    <Text h1 key={node.key}>
      {children}
    </Text>
  ),
  heading2: (node, children) => (
    <Text h2 key={node.key}>
      {children}
    </Text>
  ),
  heading3: (node, children) => (
    <Text h3 key={node.key}>
      {children}
    </Text>
  ),
  heading4: (node, children) => (
    <Text h4 key={node.key}>
      {children}
    </Text>
  ),
  softbreak: (node) => <Text key={node.key}> </Text>,
};

const Markdown = ({ content }: { content: string }) => {
  return (
    <MarkdownRenderer style={styles} rules={rules}>
      {content}
    </MarkdownRenderer>
  );
};

export default Markdown;

const styles = StyleSheet.create({
  body: {
    fontFamily: montserrat,
  },
  strong: {
    fontFamily: montserratBold,
    fontWeight: "normal",
  },
  em: {
    // TODO Install the montserrat italic, otherwise this doesn't work
    fontFamily: montserrat,
  },
});
