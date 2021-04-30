import Bluebird from "bluebird";
import fs from "expo-fs";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import Header from "../../../../components/Header/Header.component";
import { dirname, join } from "../../../../services/fs/fs.service";

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type Item = {
  parentDir?: string;
  itemPath: string;
  name: string;
  stats: Awaited<ReturnType<typeof fs.promises.stat>>;
};

const keyExtractor = (item: Item) => item.itemPath;

const BrowseFileSystem = () => {
  const [contents, setContents] = useState<Item[]>([]);

  const navigateToPath = useCallback(
    async (currentDirectoryPath: string) => {
      // First, empty the current UI, so the user can't choose another path, a
      // cheap version of a loading spinner!
      setContents([]);

      const contents = fs.promises.readdir(currentDirectoryPath);
      const items = await Bluebird.map(contents, async (name) => {
        const itemPath = join(currentDirectoryPath, name);
        const stats = await fs.promises.stat(itemPath);
        return {
          parentDir: currentDirectoryPath,
          name,
          itemPath,
          stats,
        };
      });

      const first =
        currentDirectoryPath === "/"
          ? []
          : [
              {
                name: "..",
                itemPath: dirname(currentDirectoryPath),
                stats: await fs.promises.stat(currentDirectoryPath),
              },
            ];

      const all = first.concat(items);

      setContents(all);
    },
    [setContents]
  );

  const showFile = useCallback(async (path: string) => {
    const content = await fs.promises.readFile(path, { encoding: "utf8" });
    Alert.alert("File contents", content);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      return (
        <Button
          title={item.name}
          onPress={() => {
            if (item.stats.isDirectory()) {
              navigateToPath(item.itemPath);
            } else if (item.stats.isFile()) {
              console.log("showFile() #cTOvtg");
              showFile(item.itemPath);
            }
          }}
        />
      );
    },
    [navigateToPath, showFile]
  );

  useEffect(() => {
    navigateToPath("/");
  }, []);

  return (
    <View>
      <Header title="Browse file system" />
      <Text>
        This is an ultra simple file browser. Opening files which are not text
        may break your phone, eat your cat, or open a black hole and swallow
        your hand. You have been warned.
      </Text>
      <FlatList
        data={contents}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};
export default BrowseFileSystem;
