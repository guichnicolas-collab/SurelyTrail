import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { TrailData } from "./TrailMap.web";
import { StyleSheet, View, Pressable, Text } from "react-native";

type propTypes = {
  trailData: TrailData | null;
  onClose: (name: string) => void;
};

function SlideIn(props: propTypes) {
  if (!props.trailData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton}
        onPress={() => {
          if (!props.trailData){
            return;
          }

          if (props.trailData.name){
              props.onClose(props.trailData.name);
          }
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Pressable>
      <Text style={styles.title}>{props.trailData.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: 320,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 24,
    boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
    // overflowY: "auto",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  closeButton: {
    marginBottom: 16
  }
})

export default SlideIn;
