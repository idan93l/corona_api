const selectContinent = document.querySelector(".continent");
const selectCountry = document.querySelector(".countries");
const buttons = document.querySelector("buttons");
const confirmed = document.querySelector(".confirmed");
const deaths = document.querySelector(".deaths");
const recovered = document.querySelector(".recovered");
const critical = document.querySelector(".critical");
const fetchedInfo = document.querySelector(".fetchedInfo");
const totalCases = document.querySelector(".totalCases");
const newCases = document.querySelector(".newCases");
const totalDeaths = document.querySelector(".totalDeaths");
const newDeaths = document.querySelector(".newDeaths");
const totalRecovered = document.querySelector(".totalRecovered");
const inCritical = document.querySelector(".inCritical");

let continentArray;

const ctx = document.getElementById("myChart").getContext("2d");

let gradient = ctx.createLinearGradient(0, 0, 0, 500);
gradient.addColorStop(0, "#a8dadc");
gradient.addColorStop(1, "#a8dadc32");

let labels = [];

const data = {
  labels,
  datasets: [
    {
      data: [],
      label: "Covid 19",
      fill: true,
      backgroundColor: gradient,
      borderColor: "#fff",
      pointBackgroundColor: "#e63946",
      tension: 0.3,
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    radius: 5,
    hitRadius: 30,
    hoverRadius: 12,
    responsive: true,
  },
};

const myChart = new Chart(ctx, config);
// };

const getCountryCode = () => {
  for (let i = 0; i < continentArray.length; i++) {
    if (selectCountry.value === continentArray[i].country) {
      return continentArray[i].code;
    }
  }
};

const continentInput = () => {
  let input = selectContinent.value;
  return input;
};

const getContinent = async () => {
  let continent = continentInput();
  continentArray = [];
  removeLabels(myChart);
  try {
    const data = await (
      await fetch(
        `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${continent}`
      )
    ).json();
    selectCountry.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let { name, cca2 } = data[i];
      let tempObj = { country: name.common, code: cca2 };
      selectCountry.innerHTML += `<option value="${name.common}">${name.common}</option>`;
      continentArray.push(tempObj);
      addLabels(myChart, name.common);
    }
  } catch (err) {
    console.log(err);
  }
  // console.log(continentArray);
};

const getCoronaInfo = async (text) => {
  removeData(myChart);
  try {
    const data = await (await fetch(`https://corona-api.com/countries`)).json();
    for (let i = 0; i < data.data.length; i++) {
      for (let j = 0; j < continentArray.length; j++) {
        if (continentArray[j].code === data.data[i].code) {
          addData(myChart, data.data[i].latest_data[text]);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getCountryCoronaInfo = async () => {
  let countryCode = await getCountryCode();
  try {
    const data = await (
      await fetch(`https://corona-api.com/countries/${countryCode}`)
    ).json();
    totalCases.innerHTML = data.data.latest_data.confirmed;
    newCases.innerHTML = data.data.today.confirmed;
    totalDeaths.innerHTML = data.data.latest_data.deaths;
    newDeaths.innerHTML = data.data.today.deaths;
    totalRecovered.innerHTML = data.data.latest_data.recovered
    inCritical.innerHTML = data.data.latest_data.critical
    console.log(data.data);
    // injectHtml(data);
  } catch (err) {
    console.log(err);
  }
};

function removeLabels(chart) {
  chart.data.labels = [];
  // chart.data.datasets.forEach((dataset) => {
  //   dataset.data = [];
  // });
  chart.update();
}

function addLabels(chart, label) {
  chart.data.labels.push(label);
  // chart.data.datasets.forEach((dataset) => {
  //   dataset.data.push(data);
  // });
  chart.update();
}

function removeData(chart) {
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  chart.update();
}

function addData(chart, data) {
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function buttonPushed(button) {
  let buttons = [confirmed, deaths, recovered, critical];
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] !== button) {
      buttons[i].style.backgroundColor = "#457b9d";
      buttons[i].style.color = "#f1faee";
    } else {
      buttons[i].style.backgroundColor = "#a8dadc";
      buttons[i].style.color = "#1d3557";
    }
  }
}

selectContinent.addEventListener("click", getContinent);

// getContinentInfo.addEventListener("click", getContinent);

selectCountry.addEventListener("click", getCountryCoronaInfo);

// getCountryInfo.addEventListener("click", getCountryCoronaInfo);

confirmed.addEventListener("click", () => {
  const text = confirmed.classList.value;
  getCoronaInfo(text);
  buttonPushed(confirmed);
  // confirmed.style.backgroundColor = 'aqua'
});
deaths.addEventListener("click", () => {
  const text = deaths.classList.value;
  getCoronaInfo(text);
  buttonPushed(deaths);
});
recovered.addEventListener("click", () => {
  const text = recovered.classList.value;
  getCoronaInfo(text);
  buttonPushed(recovered);
});
critical.addEventListener("click", () => {
  const text = critical.classList.value;
  getCoronaInfo(text);
  buttonPushed(critical);
});
