import { FlatList, View } from "react-native";

import ThreadData from "./threadData";

const ThreadList = ({ data, displayImg, contactNumbers }) => {
  const contactNums = contactNumbers.map((num) => num.slice(-4));

  const filteredThread = data.filter((thrd) => {
    const lastFourDigits = thrd.phoneNo.toString().slice(-4);

    const me = contactNums.find((digit) => {
      return digit.includes(lastFourDigits);
    });

    return me;
  });

  function renderThreads(itemData) {
    return <ThreadData {...itemData.item} displayImg={displayImg} />;
  }

  return (
    <View>
      <FlatList
        data={filteredThread}
        renderItem={renderThreads}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ThreadList;
