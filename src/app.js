import { FetchWrapper } from "./fetch-wrapper.js";
import simple_number_formatter from "../node_modules/@skalwar/simple_number_formatter";
// import snackbar from "../node_modules/snackbar/dist/snackbar.min.css";
import Chart from "../node_modules/chart.js/auto";

const form = document.querySelector("form");
let myChart = { destroy: () => {} };
let foodCal = document.getElementById("calories");
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

const addItem = async () => {
  let fat = Number(document.getElementById("fat").value);
  let protein = Number(document.getElementById("protein").value);
  let carbs = Number(document.getElementById("carbs").value);
  let foodname = String(document.getElementById("foods").value);

  let body = {
    fields: {
      fat: {
        integerValue: fat,
      },
      protein: {
        integerValue: protein,
      },
      carbs: {
        integerValue: carbs,
      },
      foodname: {
        stringValue: foodname,
      },
    },
  };
  const newItem = await API.post("malram333", body);
  console.log(newItem);
  newChart(carbs, protein, fat);
  // snackbar.show("Added sucessfully");
  addCard(newItem);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addItem();
});

const getItems = async () => {
  const response = await API.get("malram333");
  console.log({ response: response.documents });
  response.documents.map((item) => addCard(item));
};

// let json = API.get("malram");
// API.get(json).then((data) => {
//   console.log(data);

const newChart = (carbs, protein, fat) => {
  const ctx = document.getElementById("myChart");
  myChart.destroy();
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Carbs", "Fat", "Protein"],
      datasets: [
        {
          label: "Macronutrients",
          data: [carbs, protein, fat],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// const calorieCalc = (item) => {
//   const totalCal =
//   //
//   // console.log(calories);
// };

const addCard = (item) => {
  const carb = item.fields.carbs.integerValue;
  const protein = item.fields.protein.integerValue;
  const fat = item.fields.fat.integerValue;
  const cal = 4 * carb + 4 * protein + 9 * fat;
  const card = `
  <div class="card">
  <div class="top">
    <h1>${item.fields.foodname.stringValue}</h1>
    <p>${cal} kcal</p>
  </div>
  <div class="bottom">
    <ul>
      <li><strong>Carbs:</strong> ${carb}g</li>  
      <li><strong>Protein:</strong> ${protein}g</li>  
      <li><strong>Fat:</strong> ${fat}g</li>  
    </ul>
  </div>`;

  document.querySelector(".cards").insertAdjacentHTML("beforeend", card);

  // let totalCal = cal;
  // foodCal.textContent = totalCal;
  let totalCal = foodCal.textContent;
  totalCal = Number(totalCal.replace(",", "")) + cal;
  foodCal.textContent = totalCal;
};

getItems();
// calorieCalc(carbs, protein, fat);
