import * as RomiCore from '@osrf/romi-js-core-interfaces';

export default function fakeDoorStates(): Record<string, RomiCore.DoorState> {
  return {
    Door1: {
      door_name: 'main_door',
      current_mode: { value: RomiCore.DoorMode.MODE_OPEN },
      door_time: { sec: 0, nanosec: 0 },
    },
    Door2: {
      door_name: 'hardware_door',
      current_mode: { value: RomiCore.DoorMode.MODE_CLOSED },
      door_time: { sec: 0, nanosec: 0 },
    },
  };
}
