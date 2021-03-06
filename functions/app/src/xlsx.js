const xlsx = require("xlsx");
const fetch = require("node-fetch");

export default function XLSX(
  file,
  projectName,
  depot,
  carriersInfo,
  options,
  organization
) {
  file.arrayBuffer().then((buffer) => {
    const book = xlsx.read(buffer, { type: "buffer" });
    const sheetName = book.SheetNames[0];
    const sheet = book.Sheets[sheetName];

    const date = new Date().toISOString().substr(0, 11).replace(/-/gi, "");
    //ISOtime("12:00") とすると	20201024T120000+0900といった様になるようにする
    let ISOtime = (value) => {
      value = value.trim();
      if (value.length === 4) {
        return date + "0" + value.replace(/:/, "") + "00+0900";
      } else {
        return date + value.replace(/:/, "") + "00+0900";
      }
    };
    //入力が無かった不要なoptionを削除(初期値をnullとしてあるプロパティ)
    const optionsCopy = Object.assign({}, options);
    if (!optionsCopy.balancing.type || !optionsCopy.balancing.intensity) {
      delete optionsCopy.balancing;
    }
    if (
      !optionsCopy.turnDirectionRestriction.direction ||
      !optionsCopy.turnDirectionRestriction.intensity
    ) {
      delete optionsCopy.turnDirectionRestriction;
    }
    if (!optionsCopy.calculationTime) {
      delete optionsCopy.calculationTime;
    }

    const requestBody = {
      name: projectName,
      depot: {
        name: depot.name,
        geocode: {
          lat: +depot.lat,
          lng: +depot.lng,
        },
      },
      carriers: [],
      spots: [],
      jobs: [],
      option: optionsCopy,
    };

    //exelでA1にp_latが書かれている時、data.p_latにAを入れるようにしています。
    const data = {
      job_name: null,
      p_address: null,
      p_lat: null,
      p_lng: null,
      p_name: null,
      p_tw1s: null,
      p_tw1e: null,
      p_service_duration: null,
      p_travel_duration: null,

      d_address: null,
      d_lat: null,
      d_lng: null,
      d_name: null,
      d_tw1s: null,
      d_tw1e: null,
      d_service_duration: null,
      d_travel_duration: null,

      size: null,
    };

    //carrierの設定
    const addCarrier = (
      numOfCars,
      capacity,
      start,
      end,
      ready,
      due,
      duration
    ) => {
      const car = {
        capacities: [
          {
            dimId: "weight",
            size: 200,
          },
        ],
        startTime: ISOtime("0:00"),
        endTime: ISOtime("23:59"),
      };
      if (capacity) {
        car.capacities[0].size = capacity;
      }
      if (start) {
        car.startTime = ISOtime(start);
      }
      if (end) {
        car.endTime = ISOtime(end);
      }
      if (ready && due && duration) {
        car.break = {
          ranges: [
            {
              readyTime: ISOtime(ready),
              dueTime: ISOtime(due),
            },
          ],
          duration: duration * 60,
        };
      }
      //台数分ループを回す
      for (let i = 0; i < numOfCars; i++) {
        requestBody.carriers.push(car);
      }
    };

    //出発時間などの違う車両のためのループ（現時点で５つまで）
    for (let k = 0; k < 5; k++) {
      //作った画面上で５つのうち台数が設定されている項目のみを追加
      if (carriersInfo.numOfCars[k]) {
        //上で作ったaddcarrierに引数を渡して実行
        addCarrier(
          +carriersInfo.numOfCars[k],
          +carriersInfo.capacity[k],
          carriersInfo.start[k],
          carriersInfo.end[k],
          carriersInfo.ready[k],
          carriersInfo.due[k],
          +carriersInfo.duration[k]
        );
      }
    }

    for (let i = 0; i < 26; i++) {
      //forを使いループを回すため数値からアルファベットを取得
      //A1がp_nameである時,data.p_name = A,
      //B1がp_latである時、data.p_lat = B,   . . .となるようにする

      const alphabet = String.fromCodePoint(65 + i);

      if (sheet[alphabet + "1"]) {
        switch (sheet[alphabet + "1"].v.trim()) {
          case "job_name":
            data.job_name = alphabet;
            break;
          case "p_address":
            data.p_address = alphabet;
            break;
          case "p_name":
            data.p_name = alphabet;
            break;
          case "p_lat":
            data.p_lat = alphabet;
            break;
          case "p_lng":
            data.p_lng = alphabet;
            break;
          case "p_tw1s":
            data.p_tw1s = alphabet;
            break;
          case "p_tw1e":
            data.p_tw1e = alphabet;
            break;
          case "p_service_duration":
            data.p_service_duration = alphabet;
            break;
          case "p_travel_duration":
            data.p_travel_duration = alphabet;
            break;
          case "d_name":
            data.d_name = alphabet;
            break;
          case "d_address":
            data.d_address = alphabet;
            break;
          case "d_lat":
            data.d_lat = alphabet;
            break;
          case "d_lng":
            data.d_lng = alphabet;
            break;
          case "d_tw1s":
            data.d_tw1s = alphabet;
            break;
          case "d_tw1e":
            data.d_tw1e = alphabet;
            break;
          case "d_service_duration":
            data.d_service_duration = alphabet;
            break;
          case "d_travel_duration":
            data.d_travel_duration = alphabet;
            break;

          case "size":
            data.size = alphabet;
            break;

          default:
            break;
        }
      }
    }

    //必須項目(lat, lng)のkeyとなる’p_lat’などの値が用意されてないexcelデータの場合、return
    if ((!data.p_lat && !data.p_lat) || (!data.d_lat && !data.d_lng)) {
      window.alert("error 3 : 入力内容に誤りがあります。");
      return;
    }
    let overlapCount = 0;
    let emptyCount = 0;
    const joinBox = [];
    let alreadyNumber;

    //下のループの回数となるdataの数を,excelの行の数 - 1(1行目はp＿latといった値になっているため)としている
    const numOfData = +sheet["!ref"].replace(/..../, "") - 1;
    // (ex, sheet["!ref"] => A1:T15)

    //1つの行につき1つのjobをリクエストボディに追加していく
    //exelの2行目からデータを得る想定なので、i = 2でループを始めています。
    for (let i = 2; i < numOfData + 2; i++) {
      //excelの下の方にある空欄が行数にカウントされている場合の対策のため,その行に必須項目の入力がない場合break
      if (
        (!sheet[data.p_lat + i] && !sheet[data.p_lat + i]) ||
        (!sheet[data.d_lat + i] && !sheet[data.d_lng + i])
      ) {
        break;
      }

      const job = {
        demands: [
          {
            dimId: "weight",
            size: 10,
          },
        ],
      };
      //job名があれば追加
      if (sheet[data.job_name + i]) {
        job.name = sheet[data.job_name + i].v;
      }
      if (sheet[data.size + i]) {
        job.demands[0].size = sheet[data.size + i].v;
      }
      //pickupがあるかどうか
      if (sheet[data.p_lat + i] && sheet[data.p_lng + i]) {
        let isNew = true;
        const join =
          String(sheet[data.p_lat + i].v) + String(sheet[data.p_lng + i].v);
        //同じスポットが既に出ていないか確認
        for (let k = 0; k < joinBox.length; k++) {
          if (join === joinBox[k]) {
            isNew = false;
            alreadyNumber = k;
            overlapCount++;
            break;
          }
        }
        if (isNew) {
          joinBox.push(join);

          const pickupSpot = {
            //重複した場合と、pickupかdeliveryのどちらかがなかった場合、その分引き、idの番号とjoinBoxの配列の番号を揃える
            id: String(2 * i - overlapCount - emptyCount),
            //最初のspotIdは4で始まる
            geocode: {
              lat: sheet[data.p_lat + i].v,
              lng: sheet[data.p_lng + i].v,
            },
            guidanceLocations: [
              {
                geocode: {
                  lat: sheet[data.p_lat + i].v,
                  lng: sheet[data.p_lng + i].v,
                },
                uTurnCost: 10000,
                travelDuration: 0,
              },
            ],
          };
          //住所があれば追加
          if (sheet[data.p_address + i]) {
            const address = sheet[data.p_address + i].v;
            pickupSpot.address = { address1: address };
          }

          //名前があれば追加
          if (sheet[data.p_name + i]) {
            const name = sheet[data.p_name + i].v;
            if (typeof name !== "string") {
              window.alert("spotの名前は文字列で指定してください。");
              return;
            }

            pickupSpot.name = name;
          }
          //travelDurationがあれば追加
          if (sheet[data.p_travel_duration + i]) {
            pickupSpot.guidanceLocations[0].travelDuration =
              sheet[data.p_travel_duration + i].v * 60;
          }
          //pickupSpotをプッシュ
          requestBody.spots.push(pickupSpot);
          //pushしたスポットを使いjobのpickupを追加
          job.pickup = {
            spotId: String(2 * i - overlapCount - emptyCount),
            serviceDuration: 0,
          };
        } else {
          //同じスポットが既に出ていた場合,最初に登録したspotIdを入れる
          job.pickup = {
            spotId: String(alreadyNumber + 4),
            //spotIdが 4 から始まっているため、joinBoxの配列の番号にプラス4をする
            serviceDuration: 0,
          };
        }

        if (sheet[data.p_tw1s + i] && sheet[data.p_tw1e + i]) {
          let readyTime = sheet[data.p_tw1s + i].w.trim();
          let dueTime = sheet[data.p_tw1e + i].w.trim();
          if (readyTime.length === 4) {
            readyTime = "0" + readyTime;
          }
          if (dueTime.length === 4) {
            dueTime = "0" + dueTime;
          }

          job.pickup.timeWindow = {
            ranges: [
              { readyTime: ISOtime(readyTime), dueTime: ISOtime(dueTime) },
            ],
          };
        }

        if (sheet[data.p_service_duration + i]) {
          job.pickup.serviceDuration =
            sheet[data.p_service_duration + i].v * 60;
        }
      } else {
        emptyCount++;
      }

      //deliveryがあるかどうか
      if (sheet[data.d_lat + i] && sheet[data.d_lng + i]) {
        let isNew = true;
        const join =
          String(sheet[data.d_lat + i].v) + String(sheet[data.d_lng + i].v);
        for (let k = 0; k < joinBox.length; k++) {
          if (join === joinBox[k]) {
            isNew = false;
            alreadyNumber = k;
            overlapCount++;
            break;
          }
        }
        if (isNew) {
          joinBox.push(join);

          const deliverySpot = {
            id: String(2 * i + 1 - overlapCount - emptyCount),
            geocode: {
              lat: sheet[data.d_lat + i].v,
              lng: sheet[data.d_lng + i].v,
            },
            guidanceLocations: [
              {
                geocode: {
                  lat: sheet[data.d_lat + i].v,
                  lng: sheet[data.d_lng + i].v,
                },
                uTurnCost: 10000,
                travelDuration: 0,
              },
            ],
          };
          //住所
          if (sheet[data.d_address + i]) {
            const address = sheet[data.d_address + i].v;
            deliverySpot.address = { address1: address };
          }
          //spot名
          if (sheet[data.d_name + i]) {
            const name = sheet[data.d_name + i].v;
            if (typeof name !== "string") {
              window.alert("spotの名前は文字列で指定してください。");
              return;
            }
            deliverySpot.name = name;
          }
          if (sheet[data.d_travel_duration + i]) {
            deliverySpot.guidanceLocations[0].travelDuration =
              sheet[data.d_travel_duration + i].v * 60;
          }
          //deliverySpotをプッシュ
          requestBody.spots.push(deliverySpot);
          job.delivery = {
            spotId: String(2 * i + 1 - overlapCount - emptyCount),
            serviceDuration: 0,
          };
        } else {
          job.delivery = {
            spotId: String(alreadyNumber + 4),
            serviceDuration: 0,
          };
        }

        if (sheet[data.d_tw1s + i] && sheet[data.d_tw1e + i]) {
          let readyTime = sheet[data.d_tw1s + i].w.trim();
          let dueTime = sheet[data.d_tw1e + i].w.trim();

          job.delivery.timeWindow = {
            ranges: [
              { readyTime: ISOtime(readyTime), dueTime: ISOtime(dueTime) },
            ],
          };
        }
        if (sheet[data.d_service_duration + i]) {
          job.delivery.serviceDuration =
            sheet[data.d_service_duration + i].v * 60;
        }
      } else {
        emptyCount++;
      }
      requestBody.jobs.push(job);
    }
    //ループが終わり、リクエストボディができたらfetch

    console.log("request = ", requestBody);
    const MyJson = JSON.stringify(requestBody);

    const URL =
      organization.name === "dev"
        ? "https://dev.loogia.tech/api/v0/projects"
        : "https://loogia.tech/api/v0/projects";

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Loogia-App-Id": organization.AppID,
        "X-Loogia-API-Key": organization.ApiKey,
      },
      mode: "cors",
      body: MyJson,
    };

    fetch(URL, postOptions)
      .then((response) => {
        if (response.status === 500) {
          window.alert("エラー : error 500");
          throw "error 500";
        }
        return response.json();
      })
      .then((data) => {
        const box = [];
        if (data.status === "error") {
          for (let i = 0; i < data.detail.length; i++) {
            console.log(data.detail[i].message);
            box.push(data.detail[i].message);
          }
          window.alert("エラー :\n" + box.join("\n"));
        } else {
          console.log("success!");
          window.alert("Loogiaにリクエストを送りました。");
        }
      })
      .catch((error) => {
        console.log(" - error - ", error);
        window.alert("入力内容に誤りがあります。");
      });
  });
}
