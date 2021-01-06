import React, { useState } from "react";
import XLSX from "./xlsx.js";
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

//inputタグからの各入力値を保持し、Appコンポーネントにある関数XLSXに引数として渡したいと思い、最初Appコンポーネントで全ての入力値を管理しようとしていたのですが、入力のたびに全ての項目がレンダリングされてしまい重くなったため、コンポーネントを分け、グローバルに変数を宣言し、この値を関数XLSXに渡しています。
let projectName = localStorage.projectName
  ? JSON.parse(localStorage.projectName)
  : "project";
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
const options = {
  allowHighway: 'Never',
  restrictUturn: false,
  balancing: {type: null, intensity: null}
}
let file;
// ここまでの値を関数XLSXの引数に渡す
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
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
  console.log("Project");
  const classes = useStyles();
  const style = {
    color: "#3f50b5",
    margin: "8px",
  };

  return (
    <div className={classes.root}>
      <Wrapper>
        <HomeTwoToneIcon color="primary" />
        <span style={style}>projectName</span>
        <TextField
          style={{ width: "19ch", marginTop: "20px" }}
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
  const classes = useStyles();

  const handleChangeName = (e) => {
    depot.name = e.target.value;
    localStorage.depot = JSON.stringify(depot);
  };
  const handleChangeLat = (e) => {
    depot.lat = e.target.value;
    localStorage.depot = JSON.stringify(depot);
  };
  const handleChangeLng = (e) => {
    depot.lng = e.target.value;
    localStorage.depot = JSON.stringify(depot);
  };

  return (
    <div className={classes.root}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <EmojiTransportationTwoToneIcon color="primary" />
        <span style={style}>depot</span>
      </div>

      <TextField
        label="name"
        style={{ width: "19ch" }}
        defaultValue={depot.name}
        onChange={handleChangeName}
      />
      <TextField
        label="lat"
        style={{ width: "19ch" }}
        defaultValue={depot.lat}
        onChange={handleChangeLat}
      />
      <TextField
        label="lng"
        style={{ width: "19ch" }}
        defaultValue={depot.lng}
        onChange={handleChangeLng}
      />
    </div>
  );
}

function Carrier() {
  console.log("Carrier");
  const classes = useStyles();
  const createForm = (i) => {
    const handleChangeNumCars = (e) => {
      carriersInfo.numOfCars[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const handleChangeCapacity = (e) => {
      carriersInfo.capacity[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };

    const handleChangeStart = (e) => {
      carriersInfo.start[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const handleChangeEnd = (e) => {
      carriersInfo.end[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const handleChangeReady = (e) => {
      carriersInfo.ready[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const handleChangeDue = (e) => {
      carriersInfo.due[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const handleChangeDuration = (e) => {
      carriersInfo.duration[i] = e.target.value;
      localStorage.carriersInfo = JSON.stringify(carriersInfo);
      console.log(carriersInfo);
    };
    const htmlForm = (
      <form className={classes.root} noValidate autoComplete="off">
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
    top: 10px;
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
  console.log("File");
  const [isSelected, setIsSelected] = useState(false);
  const [File, setFile] = useState();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <DescriptionTwoToneIcon color="primary" />
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
            color="primary"
            style={{ outline: 0, width: "15ch" }}
            component="span"
          >
            ファイルを選択
          </Button>
        </label>
        <span style={{ marginLeft: "15px", color: "gray" }}>
          {isSelected ? File.name : null}
        </span>
      </div>
    </div>
  );
}

function OptionHeader(){
  const classes = useStyles()
  return(    
    <div className={classes.root}>
      <div style={{ width: "800px", marginTop: "30px" }}>
        <TuneIcon color="primary" />
        <span style={style}>options</span>
      </div>
    </div>
)
  
}
function AllowHighway(){
  const classes = useStyles();
  const handleChange = e => {
    options.allowHighway = e.target.value;
  }
  return (
    <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">高速道路</InputLabel>
        <Select
          defaultValue={options.allowHighway}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          style={{width: '730px'}}
        >
          <MenuItem value={'Never'}>許可しない</MenuItem>
          <MenuItem value={'Always'}>常に許可</MenuItem>
          <MenuItem value={'OnFirstLeg'}>デポから出発して最初の訪問場所まで許可</MenuItem>
          <MenuItem value={'OnLastLeg'}>最後のジョブを終えてからデポに帰るまで許可</MenuItem>
          <MenuItem value={'OnFirstAndLastLeg'}>デポから出発して最初の目的地までと、最後のジョブが終わりデポに帰るまで許可</MenuItem>
        </Select>
    </FormControl>
  )
}

function Balancing(){
  const classes = useStyles();
  const handleChangeType = e => {
    options.balancing.type = e.target.value;
    console.log('balancing = ', options.balancing)
  }
  const handleChangeIntensity = e => {
    options.balancing.intensity = e.target.value
    console.log('balancing = ', options.balancing)
  }

  return (
    <div>
        <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">均等化</InputLabel>
        <Select
          defaultValue={0}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeType}
          style={{width: '357px'}}
        >
          <MenuItem value={0}>均等化しない</MenuItem>
          <MenuItem value={'duration'}>勤務時間</MenuItem>
          <MenuItem value={'service'}>訪問数</MenuItem>
        </Select>
    </FormControl>
        <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">均等化度</InputLabel>
        <Select
          defaultValue={0}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeIntensity}
          style={{width: '357px'}}
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
  )
}

function Uturn(){
  const classes = useStyles()
  const handleChange = e => {
    options.restrictUturn = e.target.value;
    console.log('restrictUturn = ', options.restrictUturn)
  }

  return (
    <FormControl className={classes.root}>
        <InputLabel id="demo-simple-select-label">Uターン</InputLabel>
        <Select
          defaultValue={options.restrictUturn}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          style={{width: '730px'}}
        >
          <MenuItem value={false}>制限しない</MenuItem>
          <MenuItem value={true}>制限する</MenuItem>
        </Select>
    </FormControl>

  )

}





function App() {
  console.log("App");
  return (
    <div className="container">
      <File />
      <Project />
      <Depot />
      <Carrier />
      <OptionHeader />
      <AllowHighway />
      <Balancing />
      <Uturn />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (file) {
            if (file.name.substr(-5, 5) === ".xlsx") {
              XLSX(file, projectName, depot, carriersInfo, options);
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
          style={{ width: "730px",padding:'30px 10px', margin: '30px 8px', outline: 0 }}
          variant='outlined'
          color="primary"
        >
          <TelegramIcon style={{ margin: "4px" }} color="primary" />
          <b>POST</b>
        </Button>
      </form>
    </div>
  );
}

export default App;
