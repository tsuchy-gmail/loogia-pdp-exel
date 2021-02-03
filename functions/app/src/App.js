import React, { useState, useEffect } from "react";
import XLSX from "./xlsx.js";
import { App_id, API_key } from "./id.js";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LocalShippingTwoToneIcon from "@material-ui/icons/LocalShippingTwoTone";
import EmojiTransportationTwoToneIcon from "@material-ui/icons/EmojiTransportationTwoTone";
import HomeTwoToneIcon from "@material-ui/icons/HomeTwoTone";
import Button from "@material-ui/core/Button";
import DescriptionTwoToneIcon from "@material-ui/icons/DescriptionTwoTone";
import TelegramIcon from "@material-ui/icons/Telegram";
import TuneIcon from "@material-ui/icons/Tune";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteSweepTwoToneIcon from "@material-ui/icons/DeleteSweepTwoTone";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import BusinessIcon from "@material-ui/icons/Business";

//inputタグからの各入力値を保持し、Appコンポーネントにある関数XLSXに引数として渡したいと思い、最初Appコンポーネントで全ての入力値を管理しようとしていたのですが、入力のたびに全ての項目がレンダリングされてしまい重くなったため、コンポーネントを分け、グローバルに変数を宣言し、この値を関数XLSXに渡しています。


let organizationList = localStorage.organizationList
  ? JSON.parse(localStorage.organizationList)
  : [
      {
        name: "土本運輸",
        ApiKey: API_key,
        AppID: App_id,
      },
    ];

let projectName = localStorage.projectName
  ? JSON.parse(localStorage.projectName)
  : "project";

let numberOfDepot = localStorage.numberOfDepot
  ? JSON.parse(localStorage.numberOfDepot)
  : 0;

let numberOfOrganization = localStorage.numberOfOrganization
  ? JSON.parse(localStorage.numberOfOrganization)
  : 0;

const depotList = localStorage.depotList
  ? JSON.parse(localStorage.depotList)
  : [
      {
        name: "東京駅",
        lat: 35.681254,
        lng: 139.767146,
      },
    ];

const depot = localStorage.depot
  ? JSON.parse(localStorage.depot)
  : {
      name: "東京駅",
      lat: 35.681254,
      lng: 139.767146,
    };
const carriersInfo = localStorage.carriersInfo
  ? JSON.parse(localStorage.carriersInfo)
  : {
      numOfCars: [3, null, null, null, null],
      capacity: [200, null, null, null, null],
      start: ["0:00", null, null, null, null],
      end: ["23:59", null, null, null, null],
      ready: Array(5).fill(null, 0),
      due: Array(5).fill(null, 0),
      duration: Array(5).fill(null, 0),
    };
const options = localStorage.options
  ? JSON.parse(localStorage.options)
  : {
      allowHighway: "Never",
      restrictUturn: false,
      balancing: { type: 0, intensity: 0 },
      forceTargetLeft: false,
      ignoreReturnTrip: false,
      keepStraight: 3,
      turnDirectionRestriction: { direction: 0, intensity: 0 },
      calculationTime: null,
    };
let file;
// ここまでの値を関数XLSXの引数に渡す
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(0),
      width: "9ch",
    },
  },
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  input: {
    display: "none",
  },
}));

const Wrapper = styled.div`
  width: 200px;
  margin-top: 30px;
`;

const style = {
  color: "#3f50b5",
  margin: "8px",
};

function Project() {
  const classes = useStyles();
  const style = {
    color: "#3f50b5",
    margin: "8px",
  };

  return (
    <div className={classes.root}>
      <Wrapper>
        <LabelImportantIcon color="primary" />
        <span style={style}>projectName</span>
        <TextField
          style={{ width: "730px", marginTop: "20px" }}
          defaultValue={projectName}
          onChange={(e) => {
            projectName = e.target.value;
            localStorage.projectName = JSON.stringify(projectName);
          }}
        />
      </Wrapper>
    </div>
  );
}

function Depot() {
  const [openRegister, setOpenRegister] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(0);

  const classes = useStyles();
  const noOutline = { outline: 0 };
  const registrationStyle = { outline: 0, width: "120px", fontSize: "13px" };
  const deleteStyle = {
    outline: 0,
    width: "120px",
    fontSize: "13px",
    left: "410px",
  };

  const handleClickOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDelete = () => {
    if (deleteNumber < selectedNumber) {
      numberOfDepot = numberOfDepot - 1;
      localStorage.numberOfDepot = JSON.stringify(numberOfDepot);
      setSelectedNumber(selectedNumber - 1);
    }
    if (deleteNumber !== 0 && deleteNumber === selectedNumber) {
      if (deleteNumber === depotList.length - 1) {
        numberOfDepot = numberOfDepot - 1;
        localStorage.numberOfDepot = JSON.stringify(numberOfDepot);
        setSelectedNumber(selectedNumber - 1);
      }
    }
    if (window.confirm("削除しますか？")) {
      depotList.splice(deleteNumber, 1);
      localStorage.depotList = JSON.stringify(depotList);
      setOpenDelete(false);
    }
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeLat = (e) => {
    const toNumber = +e.target.value;
    if (isNaN(toNumber)) {
      return;
    }
    setLat(e.target.value);
  };
  const handleChangeLng = (e) => {
    const toNumber = +e.target.value;
    if (isNaN(toNumber)) {
      return;
    }
    setLng(e.target.value);
  };
  const handleRegister = () => {
    if (!name || !lat || !lng) {
      window.alert("全ての項目に入力してください。");
      return;
    }

    let isAlready;
    depotList.forEach((depot) => {
      if (name === depot.name) {
        window.alert(`「${name}」は既に登録されています。`);
        isAlready = true;
      }
    });

    if (isAlready) {
      return;
    }

    const depot = {
      name: name,
      lat: +lat,
      lng: +lng,
    };

    depotList.push(depot);
    localStorage.depotList = JSON.stringify(depotList);

    setOpenRegister(false);
    setTimeout(() => window.alert("登録しました。"), 300);
    setName("");
    setLat("");
    setLng("");
    setSelectedNumber(depotList.length - 1);
    numberOfDepot = depotList.length - 1;
    localStorage.numberOfDepot = JSON.stringify(numberOfDepot);
  };

  const handleChangeSelect = (e) => {
    setSelectedNumber(e.target.value);
    numberOfDepot = e.target.value;
    localStorage.numberOfDepot = JSON.stringify(numberOfDepot);
  };

  useEffect(() => {
    setSelectedNumber(numberOfDepot);
  }, []);

  const handleClickSelectInDelete = (index) => {
    setDeleteNumber(index);
  };

  return (
    <div>
      <div className={classes.root}>
        <div style={{ width: "800px", marginTop: "30px" }}>
          <EmojiTransportationTwoToneIcon color="primary" />
          <span style={style}>depot</span>
          <Button
            style={registrationStyle}
            color="primary"
            onClick={handleClickOpenRegister}
          >
            ＞ デポを登録
          </Button>
          <Button
            style={deleteStyle}
            color="secondary"
            onClick={handleClickOpenDelete}
          >
            <DeleteSweepTwoToneIcon style={{ marginRight: "10px" }} />{" "}
            デポを削除
          </Button>
        </div>
      </div>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label" style={{ width: "200px" }}>
          デポを選択
        </InputLabel>
        <Select
          className={classes.selectEmpty}
          value={selectedNumber}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ width: "730px" }}
          onChange={handleChangeSelect}
        >
          {depotList.map((depot, index) => (
            <MenuItem value={index}>{depot.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Dialog
        open={openRegister}
        onClose={handleCloseRegister}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">デポを登録</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            autoFocus
            margin="dense"
            id="name"
            onChange={handleChangeName}
            label="name"
            fullWidth
          />
          <TextField
            value={lat}
            margin="dense"
            id="name"
            label="latitude"
            onChange={handleChangeLat}
            fullWidth
          />
          <TextField
            value={lng}
            margin="dense"
            id="name"
            label="longitude"
            onChange={handleChangeLng}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={noOutline}
            onClick={handleCloseRegister}
            color="primary"
          >
            Cancel
          </Button>
          <Button style={noOutline} onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">デポを登録</DialogTitle>
        <DialogContent>
          <Select
            defaultValue={0}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ width: "400px" }}
          >
            {depotList.map((depot, index) => (
              <MenuItem
                value={index}
                onClick={() => handleClickSelectInDelete(index)}
              >
                {depot.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button style={noOutline} onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button style={noOutline} onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Carrier() {
  const classes = useStyles();
  const createForm = (i) => {
    const handleChangeNumCars = (e) => {
      carriersInfo.numOfCars[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const handleChangeCapacity = (e) => {
      carriersInfo.capacity[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };

    const handleChangeStart = (e) => {
      carriersInfo.start[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const handleChangeEnd = (e) => {
      carriersInfo.end[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const handleChangeReady = (e) => {
      carriersInfo.ready[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const handleChangeDue = (e) => {
      carriersInfo.due[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const handleChangeDuration = (e) => {
      carriersInfo.duration[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
    };
    const htmlForm = (
      <form
        className={classes.root}
        style={{ marginTop: "15px" }}
        noValidate
        autoComplete="off"
      >
        <FormControl>
          <InputLabel id="demo-simple-select-label">台数</InputLabel>
          <Select
            onChange={handleChangeNumCars}
            defaultValue={carriersInfo.numOfCars[i]}
            labelId="demo-simple-select-label"
          >
            <MenuItem value={null}>-</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="text"
          defaultValue={carriersInfo.capacity[i]}
          onChange={handleChangeCapacity}
          label="積載容量"
          helperText=""
        />
        <TextField
          onChange={handleChangeStart}
          defaultValue={carriersInfo.start[i]}
          label="出発可能"
          helperText=""
        />
        <TextField
          onChange={handleChangeEnd}
          defaultValue={carriersInfo.end[i]}
          label="帰着限度"
          helperText=""
        />
        <TextField
          onChange={handleChangeReady}
          defaultValue={carriersInfo.ready[i]}
          label="休憩-ready"
          helperText="(例) 9:00"
        />
        <TextField
          onChange={handleChangeDue}
          defaultValue={carriersInfo.due[i]}
          label="休憩-due"
          helperText="(例) 15:00"
        />
        <TextField
          onChange={handleChangeDuration}
          defaultValue={carriersInfo.duration[i]}
          label="休憩時間(m)"
          helperText="(例) 60"
        />
      </form>
    );

    return htmlForm;
  };

  const style = {
    color: "#3f50b5",
    margin: "8px",
  };
  const ToLeft = styled.span`
    position: relative;
    left: -7px;
    0op: 10px;
  `;
  return (
    <div className={classes.root}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <LocalShippingTwoToneIcon color="primary" />
        <span style={style}>carrier</span>
        <ToLeft>
          {createForm(0)}
          {createForm(1)}
          {createForm(2)}
          {createForm(3)}
          {createForm(4)}
        </ToLeft>
      </div>
    </div>
  );
}

function File() {
  const [isSelected, setIsSelected] = useState(false);
  const [File, setFile] = useState();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <DescriptionTwoToneIcon color="primary" />
        <span style={{ color: "#3f50b5", fontSize: "14px", marginLeft: "8px" }}>
          Excelファイルを選択
        </span>
        <input
          type="file"
          id="file"
          className={classes.input}
          onChange={(e) => {
            setFile(e.target.files[0]);
            file = e.target.files[0];
            if (e.target.files[0]) {
              setIsSelected(true);
            } else {
              setIsSelected(false);
            }
          }}
        />
        <label htmlFor="file">
          <Button
            variant="outlined"
            style={{
              outline: 0,
              width: "727px",
              marginTop: "20px",
              marginLeft: "4px",
              border: '1px solid #949494',
              borderRadius: 0,
            }}
            component="span"
          >
            {isSelected ? "✔︎ 選択中 ー " + File.name : <span style={{color: '#787878'}}>ファイルを選択</span>}
          </Button>
        </label>
      </div>
    </div>
  );
}

function OptionHeader() {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ marginBottom: "15px" }}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <TuneIcon color="primary" />
        <span style={style}>options</span>
      </div>
    </div>
  );
}
function AllowHighway() {
  const classes = useStyles();
  const handleChange = (e) => {
    options.allowHighway = e.target.value;
    localStorage.options = JSON.stringify(options);
  };
  return (
    <FormControl className={classes.root}>
      <InputLabel id="demo-simple-select-label">高速道路</InputLabel>
      <Select
        defaultValue={options.allowHighway}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        style={{ width: "730px" }}
      >
        <MenuItem value={"Never"}>許可しない (default)</MenuItem>
        <MenuItem value={"Always"}>常に許可</MenuItem>
        <MenuItem value={"OnFirstLeg"}>
          デポから出発して最初の訪問場所まで許可
        </MenuItem>
        <MenuItem value={"OnLastLeg"}>
          最後のジョブを終えてからデポに帰るまで許可
        </MenuItem>
        <MenuItem value={"OnFirstAndLastLeg"}>
          デポから出発して最初の目的地までと、最後のジョブが終わりデポに帰るまで許可
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function Balancing() {
  const classes = useStyles();
  const handleChangeType = (e) => {
    options.balancing.type = e.target.value;
    localStorage.options = JSON.stringify(options);
  };
  const handleChangeIntensity = (e) => {
    options.balancing.intensity = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <div>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">均等化</InputLabel>
        <Select
          defaultValue={options.balancing ? options.balancing.type : 0}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeType}
          style={{ width: "357px" }}
        >
          <MenuItem value={0}>均等化しない (default)</MenuItem>
          <MenuItem value={"duration"}>勤務時間</MenuItem>
          <MenuItem value={"service"}>訪問数</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">均等化度</InputLabel>
        <Select
          defaultValue={options.balancing ? options.balancing.intensity : 0}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeIntensity}
          style={{ width: "357px" }}
        >
          <MenuItem value={0}>-</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function Uturn() {
  const classes = useStyles();
  const handleChange = (e) => {
    options.restrictUturn = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <FormControl className={classes.root}>
      <InputLabel id="demo-simple-select-label">Uターン</InputLabel>
      <Select
        defaultValue={options.restrictUturn}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        style={{ width: "730px" }}
      >
        <MenuItem value={false}>制限しない (default)</MenuItem>
        <MenuItem value={true}>
          制限する(全てのspotに10000秒のuTurnCostが振られています)
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function ForceTargetLeft() {
  const classes = useStyles();
  const handleChange = (e) => {
    options.forceTargetLeft = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <FormControl className={classes.root}>
      <InputLabel id="demo-simple-select-label">左付け</InputLabel>
      <Select
        defaultValue={options.forceTargetLeft}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        style={{ width: "730px" }}
      >
        <MenuItem value={false}>強制しない (default)</MenuItem>
        <MenuItem value={true}>強制する</MenuItem>
      </Select>
    </FormControl>
  );
}

function IgnoreReturnTrip() {
  const classes = useStyles();
  const handleChange = (e) => {
    options.ignoreReturnTrip = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <FormControl className={classes.root}>
      <InputLabel id="demo-simple-select-label">帰ルート</InputLabel>
      <Select
        defaultValue={options.ignoreReturnTrip}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        style={{ width: "730px" }}
      >
        <MenuItem value={false}>デポへの帰り道まで最適化に含める (default)</MenuItem>
        <MenuItem value={true}>
          デポへの帰り道は最適化に含めない
        </MenuItem>
      </Select>
    </FormControl>
  );
}

function KeepStraight() {
  const classes = useStyles();
  const handleChange = (e) => {
    options.keepStraight = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <FormControl className={classes.root}>
      <InputLabel style={{ width: "100px" }} id="demo-simple-select-label">
        直進維持度
      </InputLabel>
      <Select
        defaultValue={options.keepStraight}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        style={{ width: "730px" }}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3 (default)</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={7}>7</MenuItem>
        <MenuItem value={8}>8</MenuItem>
        <MenuItem value={9}>9</MenuItem>
        <MenuItem value={10}>10</MenuItem>
      </Select>
    </FormControl>
  );
}

function DirectionRestriction() {
  const classes = useStyles();
  const handleChangeDirection = (e) => {
    options.turnDirectionRestriction.direction = e.target.value;
    localStorage.options = JSON.stringify(options);
  };
  const handleChangeIntensity = (e) => {
    options.turnDirectionRestriction.intensity = e.target.value;
    localStorage.options = JSON.stringify(options);
  };

  return (
    <div>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label" style={{ width: "200px" }}>
          右左折どちらか抑制
        </InputLabel>
        <Select
          defaultValue={
            options.turnDirectionRestriction
              ? options.turnDirectionRestriction.direction
              : 0
          }
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeDirection}
          style={{ width: "357px" }}
        >
          <MenuItem value={0}>抑制しない (default)</MenuItem>
          <MenuItem value={"RIGHT"}>右折</MenuItem>
          <MenuItem value={"LEFT"}>左折</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">抑制度</InputLabel>
        <Select
          defaultValue={
            options.turnDirectionRestriction
              ? options.turnDirectionRestriction.intensity
              : 0
          }
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeIntensity}
          style={{ width: "357px" }}
        >
          <MenuItem value={0}>-</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function CalculationTime() {
  const classes = useStyles();
  let initialValue = "";
  if (
    localStorage.options &&
    JSON.parse(localStorage.options).calculationTime
  ) {
    initialValue = JSON.parse(localStorage.options).calculationTime;
  }

  const [state, setState] = useState(initialValue);
  const handleBlur = (e) => {
    if (e.target.value > 900) {
      alert("900秒を超える指定はできません。");
      setState("");
    }
  };
  const handleChange = (e) => {
    const toNumber = Number(e.nativeEvent.data);
    if (isNaN(toNumber)) {
      return;
    }
    setState(e.target.value);
    options.calculationTime = Number(e.target.value);
    localStorage.options = JSON.stringify(options);
  };

  return (
    <FormControl class={classes.root}>
      <TextField
        value={state}
        label="計算時間指定 (1~900s)"
        style={{ width: "730px" }}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="自動 (default)"
        helperText="(例) 900　 ✳︎指定なし: 自動"
      />
    </FormControl>
  );
}

function Organization() {
  const [openRegister, setOpenRegister] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [name, setName] = useState("");
  const [ApiKey, setApiKey] = useState("");
  const [AppID, setAppID] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(0);

  const classes = useStyles();
  const noOutline = { outline: 0 };
  const registrationStyle = { outline: 0, width: "120px", fontSize: "13px" };
  const deleteStyle = {
    outline: 0,
    width: "120px",
    fontSize: "13px",
    left: "362px",
  };

  const handleClickOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDelete = () => {
    if (deleteNumber < selectedNumber) {
      numberOfOrganization = numberOfOrganization - 1;
      localStorage.numberOfOrganization = JSON.stringify(numberOfOrganization);
      setSelectedNumber(selectedNumber - 1);
    }
    if (deleteNumber !== 0 && deleteNumber === selectedNumber) {
      if (deleteNumber === organizationList.length - 1) {
        numberOfOrganization = numberOfOrganization - 1;
        localStorage.numberOfOrganization = JSON.stringify(
          numberOfOrganization
        );
        setSelectedNumber(selectedNumber - 1);
      }
    }
    if (window.confirm("削除しますか？")) {
      organizationList.splice(deleteNumber, 1);
      localStorage.organizationList = JSON.stringify(organizationList);
      setOpenDelete(false);
    }
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangeApiKey = (e) => {
    setApiKey(e.target.value);
  };
  const handleChangeAppID = (e) => {
    setAppID(e.target.value);
  };
  const handleRegister = () => {
    if (!name || !ApiKey || !AppID) {
      window.alert("全ての項目に入力してください。");
      return;
    }

    let isAlready;

    organizationList.forEach((organization) => {
      if (name === organization.name) {
        window.alert(`「${name}」は既に登録されています。`);
        isAlready = true;
      }
    });

    if (isAlready) {
      return;
    }

    const organization = {
      name: name,
      ApiKey: ApiKey,
      AppID: AppID,
    };
    organizationList.push(organization);
    localStorage.organizationList = JSON.stringify(organizationList);

    setOpenRegister(false);
    setTimeout(() => window.alert(`「${name}」を登録しました。`), 300);
    setName("");
    setApiKey("");
    setAppID("");
    setSelectedNumber(organizationList.length - 1);
    numberOfOrganization = organizationList.length - 1;
    localStorage.numberOfOrganization = JSON.stringify(numberOfOrganization);
  };

  const handleChangeSelect = (e) => {
    setSelectedNumber(e.target.value);
    numberOfOrganization = e.target.value;
    localStorage.numberOfOrganization = JSON.stringify(numberOfOrganization);
  };

  useEffect(() => {
    setSelectedNumber(numberOfOrganization);
  }, []);

  const handleClickSelectInDelete = (index) => {
    setDeleteNumber(index);
  };

  return (
    <div>
      <div className={classes.root}>
        <div style={{ width: "800px", marginTop: "30px" }}>
          <BusinessIcon color="primary" />
          <span style={style}>organization</span>
          <Button
            style={registrationStyle}
            color="primary"
            onClick={handleClickOpenRegister}
          >
            ＞ 組織を登録
          </Button>
          <Button
            style={deleteStyle}
            color="secondary"
            onClick={handleClickOpenDelete}
          >
            <DeleteSweepTwoToneIcon style={{ marginRight: "10px" }} />{" "}
            組織を削除
          </Button>
        </div>
      </div>
      <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label" style={{ width: "200px" }}>
          組織を選択
        </InputLabel>
        <Select
          value={selectedNumber}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ width: "730px" }}
          onChange={handleChangeSelect}
        >
          {organizationList.map((organization, index) => (
            <MenuItem value={index}>{organization.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Dialog
        open={openRegister}
        onClose={handleCloseRegister}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">組織を登録</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            autoFocus
            margin="dense"
            id="name"
            onChange={handleChangeName}
            label="name"
            fullWidth
          />
          <TextField
            value={AppID}
            margin="dense"
            id="name"
            label="App ID"
            onChange={handleChangeAppID}
            fullWidth
          />
          <TextField
            value={ApiKey}
            margin="dense"
            id="name"
            label="Api Key"
            onChange={handleChangeApiKey}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            style={noOutline}
            onClick={handleCloseRegister}
            color="primary"
          >
            Cancel
          </Button>
          <Button style={noOutline} onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">組織を登録</DialogTitle>
        <DialogContent>
          <Select
            defaultValue={0}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ width: "400px" }}
          >
            {organizationList.map((organization, index) => (
              <MenuItem
                value={index}
                onClick={() => handleClickSelectInDelete(index)}
              >
                {organization.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button style={noOutline} onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button style={noOutline} onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function App() {
  const MarginY = {marginTop: '10px'}
  return (
    <div style={{width: '1100px', margin: '0px auto', boxShadow: '0 0 30px'}}>
    <div style={{width: '770px', margin: '0 auto', paddingTop: '20px'}}>
      <File />
      <Organization />
      <Project />
      <Depot />
      <Carrier />
      <OptionHeader />
      <Balancing />
      <DirectionRestriction />
      <Uturn />
      <ForceTargetLeft />
      <IgnoreReturnTrip />
      <AllowHighway />
      <KeepStraight />
      <CalculationTime />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (file) {
            if (file.name.substr(-5, 5) === ".xlsx") {
              XLSX(
                file,
                projectName,
                depotList[numberOfDepot],
                carriersInfo,
                options,
                organizationList[numberOfOrganization]
              );
            } else {
              window.alert("error 2 : ファイルの形式が正しくありません。");
            }
          } else {
            window.alert("error 1 : ファイルを選択してください。");
          }
        }}
      >
        <Button
          type="submit"
          style={{
            width: "730px",
            padding: "30px 10px",
            margin: "30px 8px",
            outline: 0,
          }}
          variant="outlined"
          color="primary"
        >
          <TelegramIcon style={{ margin: "4px" }} color="primary" />
          <b>計算開始</b>
        </Button>
      </form>
    </div>
    </div>
  );
}

export default App;
