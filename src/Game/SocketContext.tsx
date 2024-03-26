import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { SERVER_SOCKET_URL } from "../utility/server";

const WebSocketContext = createContext<ISocketContext>({} as ISocketContext);

interface ISocketContext {
  socketConnected: boolean;
  roomstate: RoomState | undefined;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
  changeResultControlSetting: (setting: string) => void;
  changeRoundCountSetting: (roundCount: number) => void;
  changeAIModelSetting: (model: AIModel) => void;
  startGame: (
    callback: (result: { success: boolean; reason: string }) => void
  ) => void;
  submitPrompt: (
    prompt: string,
    callback: (result: { success: boolean; reason: string }) => void
  ) => void;

  submitGuess: (
    guess: string,
    callback: (result: { success: boolean; reason: string }) => void
  ) => void;
  nextResult: () => void;
  connectionError: string;
}

export type AIModel = "dall-e-3" | "dall-e-2";

type SocketContextProps = {
  children: React.ReactNode;
  userID: string;
  roomID: string;
  userAvatarSeed: string;
  accessKey: string;
};

export type RoomUser = {
  userID: string;
  username: string;
  userAvatarSeed: string;
  credits: number;
};

type RoomSettings = {
  maxPlayer: number;
  nextResultPermission: "AUTHOR" | "HOST";
  aiModel: AIModel;
  roundCount: number;
};

export type Result = {
  topic: string;
  prompt: string;
  guess: string;
  imageURI: string;
  prompter: { userID: string; userAvatarSeed: string; username: string };
  guesser: { userID: string; userAvatarSeed: string; username: string };
};

export interface TopicGroup {
  topic: string;
  itemCount: number;
}

type RoomState = {
  roomID: string;
  state: "LOBBY" | "GAME" | "RESULTS";
  creator: string;
  settings: RoomSettings;
  users: RoomUser[];
  lobbyState: { availableTopics: TopicGroup[]; selectedTopics: string[] };
  gameState: { round: "PROMPTING" | "GUESSING" };
  resultState: {
    results: Result[];
    resultPlace: number;
    currentRevealer: string;
  };
  userGameState: GameStateUser;
};

interface GameStateUser {
  topics: string[];
  prompts: string[];
  imageURIsFromPrompts: string[];
  topicPlace: number;
  // to answer
  imagesToGuess: string[];
  guesses: string[];
  guessPlace: number;
}

export default function SocketContext({
  children,
  userID,
  roomID,
  userAvatarSeed,
  accessKey,
}: SocketContextProps) {
  const socket = useRef<Socket>();
  const [socketConnected, setSocketConnected] = useState(false);
  const [roomstate, setRoomstate] = useState<RoomState>();
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    console.log("connection");
    const _socket: Socket = io(SERVER_SOCKET_URL, {
      query: {
        userID: userID,
        roomID: roomID,
        userAvatarSeed: userAvatarSeed,
        accessKey: accessKey,
      },
    });

    // TODO : what if there are socket connection problems
    setSocketConnected(true);

    socket.current = _socket;

    _socket.on("connect", () => {
      console.log("entered the room");
    });

    _socket.on("roomstate_update", (roomstate: RoomState) => {
      setRoomstate(roomstate);
    });

    _socket.on("disconnect", () => {
      console.log("disconnected");
      setSocketConnected(false);
    });

    _socket.on("connect_error", (err) => {
      console.log("CONNECTION ERROR: " + err);
      // setSnackbarOpen({
      //     open: true,
      //     message: "Connection error!",
      //     severity: "error",
      // });
      // setError({ error: true, message: err.message });
      setConnectionError(err.message);
    });

    return () => {
      _socket.disconnect();
    };
  }, []);

  const addTopic = (topic: string) => {
    if (socket.current == undefined) return;

    socket.current.emit("lobby:select_topic", topic);
  };

  const removeTopic = (topic: string) => {
    if (socket.current == undefined) return;

    socket.current.emit("lobby:remove_topic", topic);
  };

  const changeResultControlSetting = (setting: string) => {
    if (socket.current == undefined) return;

    socket.current.emit("lobby:setting:change_result_control", setting);
  };

  const changeRoundCountSetting = (roundCount: number) => {
    socket.current?.emit("lobby:setting:change_round_count", roundCount);
  };

  const changeAIModelSetting = (model: AIModel) => {
    socket.current?.emit("lobby:setting:change_ai_model", model);
  };

  const startGame = (
    callback: (result: { success: boolean; reason: string }) => void
  ) => {
    socket.current?.emit("lobby:start_game", null, callback);
  };

  const submitPrompt = (
    prompt: string,
    callback: (result: { success: boolean; reason: string }) => void
  ) => {
    socket.current?.emit("game:submit_prompt", prompt, callback);
  };

  const submitGuess = (
    guess: string,
    callback: (result: { success: boolean; reason: string }) => void
  ) => {
    socket.current?.emit("game:submit_guess", guess, callback);
  };

  const nextResult = () => {
    socket.current?.emit("result:next_result");
  };

  return (
    <WebSocketContext.Provider
      value={{
        roomstate: roomstate,
        addTopic: addTopic,
        removeTopic: removeTopic,
        changeResultControlSetting: changeResultControlSetting,
        changeRoundCountSetting: changeRoundCountSetting,
        changeAIModelSetting: changeAIModelSetting,
        startGame: startGame,
        submitPrompt: submitPrompt,
        submitGuess: submitGuess,
        nextResult: nextResult,
        socketConnected: socketConnected,
        connectionError: connectionError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
