import { snackbar, socket, stats } from "../main";

export const registerAudioChatListener = (audioChatPopup) => {
  socket.on("play-audio", (data) => {
    const audio = new Audio(data);
    audio.play();
  });

  socket.on("participant-mute", () => {
    audioChatPopup.participant.mute();
  });

  socket.on("participant-unmute", () => {
    audioChatPopup.participant.unmute();
  });

  socket.on("chat-exit", () => {
    snackbar.configure(
      `${audioChatPopup.participant.username} has left the audio chat!`,
      "sad"
    );
    snackbar.show();
    stats.incrementExp(10);
  });
};
