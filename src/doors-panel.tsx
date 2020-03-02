import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Typography,
  Divider,
  Button,
  ButtonGroup,
  useTheme,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';

function doorModeToString(doorState?: RomiCore.DoorState): string {
  if (!doorState) {
    return 'UNKNOWN';
  }
  switch (doorState.current_mode.value) {
    case RomiCore.DoorMode.MODE_OPEN:
      return 'OPEN';
    case RomiCore.DoorMode.MODE_CLOSED:
      return 'CLOSED';
    case RomiCore.DoorMode.MODE_MOVING:
      return 'MOVING';
    default:
      return 'UNKNOWN';
  }
}

const useStyles = makeStyles(() => ({
  expansionSummaryContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  expansionDetail: {
    flexFlow: 'column',
  },

  expansionDetailLine: {
    display: 'inline-flex',
    justifyContent: 'space-between',
  },
}));

const useDoorModeLabelStyles = makeStyles(theme => {
  const base: CSSProperties = {
    borderRadius: theme.shape.borderRadius,
    borderStyle: 'solid',
    border: 2,
    padding: 5,
    width: '5em',
    textAlign: 'center',
  };

  return {
    open: {
      ...base,
      borderColor: theme.palette.success.main,
    },

    closed: {
      ...base,
      borderColor: theme.palette.error.main,
    },

    moving: {
      ...base,
      borderColor: theme.palette.warning.main,
    },
  };
});

function doorTypeToString(doorType: number): string {
  switch (doorType) {
    case RomiCore.Door.DOOR_TYPE_DOUBLE_SLIDING:
      return 'Double Sliding';
    case RomiCore.Door.DOOR_TYPE_DOUBLE_SWING:
      return 'Double Swing';
    case RomiCore.Door.DOOR_TYPE_DOUBLE_TELESCOPE:
      return 'Double Telescope';
    case RomiCore.Door.DOOR_TYPE_SINGLE_SLIDING:
      return 'Sliding';
    case RomiCore.Door.DOOR_TYPE_SINGLE_TELESCOPE:
      return 'Telescope';
    default:
      return `Unknown (${doorType})`;
  }
}

function motionDirectionToString(motionDirection: number): string {
  switch (motionDirection) {
    case 1:
      return 'Clockwise';
    case -1:
      return 'Anti-Clockwise';
    default:
      return `Unknown (${motionDirection})`;
  }
}

interface DoorsPanelProps {
  buildingMap: RomiCore.BuildingMap;
  doorStates: { [key: string]: RomiCore.DoorState };
}

export default function DoorsPanel(props: DoorsPanelProps): JSX.Element {
  const theme = useTheme();
  const classes = useStyles();

  const doorModeLabelClasses = useDoorModeLabelStyles();
  const doorModelLabelClass = (doorMode: RomiCore.DoorMode) => {
    switch (doorMode.value) {
      case RomiCore.DoorMode.MODE_OPEN:
        return doorModeLabelClasses.open;
      case RomiCore.DoorMode.MODE_CLOSED:
        return doorModeLabelClasses.closed;
      case RomiCore.DoorMode.MODE_MOVING:
        return doorModeLabelClasses.moving;
      default:
        return '';
    }
  };

  const listItems = props.buildingMap.levels
    .flatMap(level => level.doors)
    .map(door => {
      const doorState = props.doorStates[door.name];
      return (
        <ExpansionPanel key={door.name}>
          <ExpansionPanelSummary
            classes={{ content: classes.expansionSummaryContent }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant="h5">{door.name}</Typography>
            <div className={doorModelLabelClass(doorState.current_mode)}>
              <Typography variant="button">
                {doorModeToString(doorState)}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionDetail} >
            <div className={classes.expansionDetailLine}>
              <Typography variant="body1">Type:</Typography>
              <Typography variant="body1">
                {doorTypeToString(door.door_type)}
              </Typography>
            </div>
            <Divider />
            <div className={classes.expansionDetailLine}>
              <Typography variant="body1">Motion Direction:</Typography>
              <Typography variant="body1">
                {motionDirectionToString(door.motion_direction)}
              </Typography>
            </div>
            <Divider />
            <div className={classes.expansionDetailLine}>
              <Typography variant="body1">Motion Range:</Typography>
              <Typography variant="body1">{door.motion_range}</Typography>
            </div>
            <Divider />
            <div className={classes.expansionDetailLine}>
              <Typography variant="body1">Location:</Typography>
              <Typography variant="body1">
                ({door.v1_x}, {door.v1_y})
              </Typography>
            </div>
            <ButtonGroup style={{ marginTop: theme.spacing(1) }} fullWidth>
              <Button>Close</Button>
              <Button>Open</Button>
            </ButtonGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });

  return <React.Fragment>{listItems}</React.Fragment>;
}
