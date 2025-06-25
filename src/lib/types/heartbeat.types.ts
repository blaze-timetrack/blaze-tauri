interface Time {
  start: String;
  End: String;
  duration: Number;
}

export interface HeartbeatTypes {
  process_name: String;
  title: String;
  url?: String;
  time: Time;
}

export interface HeartbeatStopTypes {
  time: Time;
}
