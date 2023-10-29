import Highcharts, { ColorAxisOptions } from "highcharts";
import highchartsHeatmap from "highcharts/modules/heatmap";
import highchartsAccesibility from 'highcharts/modules/accessibility';
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";
import './App.css';
highchartsHeatmap(Highcharts);
highchartsAccesibility(Highcharts);


// This type is used to structure our employees data.
interface WeekdayData {
  name: string;
  weekdaySellData: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
  };
}

// This type is used to represent all the averages and totals of our weekdays.
interface WeekdayStatistics {
  averages: Record<string, number>;
  sums: Record<string, number>;
}

// Data to fill the heatmap chart.
const weeklyData: WeekdayData[] = [
  {
    name: "Alexander",
    weekdaySellData: {
      monday: 10,
      tuesday: 19,
      wednesday: 8,
      thursday: 24,
      friday: 67
    }
  },
  {
    name: "Marie",
    weekdaySellData: {
      monday: 92,
      tuesday: 58,
      wednesday: 78,
      thursday: 117,
      friday: 48,
    }
  },
  {
    name: "Maximillian",
    weekdaySellData: {
      monday: 35,
      tuesday: 15,
      wednesday: 123,
      thursday: 64,
      friday: 52,
    }
  },
  {
    name: "Sophia",
    weekdaySellData: {
      monday: 72,
      tuesday: 132,
      wednesday: 114,
      thursday: 19,
      friday: 16,
    }
  },
  {
    name: "Lukas",
    weekdaySellData: {
      monday: 38,
      tuesday: 5,
      wednesday: 8,
      thursday: 117,
      friday: 115
    }
  },
  {
    name: "Maria",
    weekdaySellData: {
      monday: 88,
      tuesday: 32,
      wednesday: 12,
      thursday: 6,
      friday: 120,
    }
  },
  {
    name: "Leon",
    weekdaySellData: {
      monday: 13,
      tuesday: 44,
      wednesday: 88,
      thursday: 98,
      friday: 96,
    }
  },
  {
    name: "Anna",
    weekdaySellData: {
      monday: 31,
      tuesday: 1,
      wednesday: 82,
      thursday: 32,
      friday: 30
    }
  },
  {
    name: "Tim",
    weekdaySellData: {
      monday: 85,
      tuesday: 97,
      wednesday: 123,
      thursday: 64,
      friday: 84
    }
  },
  {
    name: "Laura",
    weekdaySellData: {
      monday: 47,
      tuesday: 114,
      wednesday: 31,
      thursday: 48,
      friday: 91
    }
  }
];

const colorAxisOptions: ColorAxisOptions = {
  stops: [
      [0, '#FFFFFF'], // Start color
      [1,"#2eb0fe"] // End color
  ]
}

// Calculates and returns the average and totals for the whole week.
function calculateWeekdayStatistics(data: WeekdayData[]): WeekdayStatistics {
  const weekdayAverages: Record<string, number> = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0
  };

  const weekdaySums: Record<string, number> = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0
  };

  const entryCount = data.length;

  for (const entry of data) {
    for (const weekday in entry.weekdaySellData) {
      if (entry.weekdaySellData.hasOwnProperty(weekday)) {
        const weekdayKey = weekday as keyof typeof entry.weekdaySellData;
        weekdayAverages[weekdayKey] += entry.weekdaySellData[weekdayKey];
        weekdaySums[weekdayKey] += entry.weekdaySellData[weekdayKey];
      }
    }
  }

  for (const weekday in weekdayAverages) {
    if (weekdayAverages.hasOwnProperty(weekday)) {
      weekdayAverages[weekday] /= entryCount;
    }
  }

  return {
    averages: weekdayAverages,
    sums: weekdaySums
  };
}

function restructureData(data: WeekdayData[]): number[][] {
  const restructuredData: number[][] = [];

  data.forEach((entry, placement) => {
    const { monday, tuesday, wednesday, thursday, friday } = entry.weekdaySellData;
    restructuredData.push([placement, 0, monday]);
    restructuredData.push([placement, 1, tuesday]);
    restructuredData.push([placement, 2, wednesday]);
    restructuredData.push([placement, 3, thursday]);
    restructuredData.push([placement, 4, friday]);
  });

  return restructuredData;
}

function restructureStats(statistics: WeekdayStatistics, dataLength: number) {

  let restructuredStats: number[][] = []
  let placement = dataLength;
  for(const stat in statistics) {
    const statKey = stat as keyof typeof statistics;
    const data = statistics[statKey];
    restructuredStats.push([placement, 0, data['monday']]);
    restructuredStats.push([placement, 1, data['tuesday']]);
    restructuredStats.push([placement, 2, data['wednesday']]);
    restructuredStats.push([placement, 3, data['thursday']]);
    restructuredStats.push([placement, 4, data['friday']]);
    placement++
  }
  return restructuredStats;
}

function getEmployeeNames(data: WeekdayData[]) {
  let employeeNames: string[] = [];

  for(const employee of data) {
    employeeNames.push(employee.name);
  }
  return employeeNames;
}


const names = getEmployeeNames(weeklyData);
names.push(...["Average", "Total"]);
const placedWeekdayData = restructureData(weeklyData);
const weekdayStatistics = calculateWeekdayStatistics(weeklyData);
const sums = restructureStats(weekdayStatistics, weeklyData.length);
// Mix average and totals with weeklydata variable.
//placedWeekdayData.push(...sums);

const options: Highcharts.Options = {
  title: {
    text: "Sales per employee per weekday",
    style: {
      fontSize: "1em",
    },
  },

  chart: {
    marginTop: 40,
    
    marginBottom: 80,
    plotBorderWidth: 1,
  },
  // Determine axes names
  xAxis: {
    categories: names 
  },
  yAxis: {
    categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  accessibility: {
    point: {
      descriptionFormat:
        "{(add index 1)}. " +
        "{series.xAxis.categories.(x)} sales " +
        "{series.yAxis.categories.(y)}, {value}.",
    },
  },

  colorAxis: colorAxisOptions, 
  legend: {
    align: "right",
    layout: "vertical",
    margin: 0,
    verticalAlign: "top",
    y: 25,
    symbolHeight: 280,
  },

  tooltip: {
    format:
      "<b>{series.xAxis.categories.(point.x)}</b> sold<br>" +
      "<b>{point.value}</b> items on <br>" +
      "<b>{series.yAxis.categories.(point.y)}</b>",
  },

  series: [
    {
      tooltip: {
        format:
          "<b>{series.xAxis.categories.(point.x)}</b> sold<br>" +
          "<b>{point.value}</b> items on <br>" +
          "<b>{series.yAxis.categories.(point.y)}</b>",
      },

      type: "heatmap",
      name: "Sales per employee",

      borderWidth: 1,
      data: 
      // [
      //   [0, 0, 10],
      //   [0, 1, 19],
      //   [0, 2, 8],
      //   [0, 3, 24],
      //   [0, 4, 67], // Alexander
      //   [1, 0, 92],
      //   [1, 1, 58],
      //   [1, 2, 78],
      //   [1, 3, 117],
      //   [1, 4, 48], // Marie
      //   [2, 0, 35],
      //   [2, 1, 15],
      //   [2, 2, 123],
      //   [2, 3, 64],
      //   [2, 4, 52], // Maximillian
      //   [3, 0, 72],
      //   [3, 1, 132],
      //   [3, 2, 114],
      //   [3, 3, 19],
      //   [3, 4, 16], // Sophia
      //   [4, 0, 38],
      //   [4, 1, 5],
      //   [4, 2, 8],
      //   [4, 3, 117],
      //   [4, 4, 115], // Lukas
      //   [5, 0, 88],
      //   [5, 1, 32],
      //   [5, 2, 12],
      //   [5, 3, 6],
      //   [5, 4, 120], // Maria
      //   [6, 0, 13],
      //   [6, 1, 44],
      //   [6, 2, 88],
      //   [6, 3, 98],
      //   [6, 4, 96], // Leon
      //   [7, 0, 31],
      //   [7, 1, 1],
      //   [7, 2, 82],
      //   [7, 3, 32],
      //   [7, 4, 30], // Anna
      //   [8, 0, 85],
      //   [8, 1, 97],
      //   [8, 2, 123],
      //   [8, 3, 64],
      //   [8, 4, 84], // Tim
      //   [9, 0, 47],
      //   [9, 1, 114],
      //   [9, 2, 31],
      //   [9, 3, 48],
      //   [9, 4, 91], // Laura
      // ],
      placedWeekdayData,
      dataLabels: { enabled: true, color: "#000000" },
      
    },
    {
      type: 'heatmap',
      data: sums,
      dataLabels: {enabled: true},
      colorKey: '#FFFFFF',
      color: '#FFFFFF'
    },

  ],
  

  responsive: {
    rules: [
      {
        condition: {
          minHeight: 100,
          maxHeight: 200,
          maxWidth: 10,
        },
        chartOptions: {
          yAxis: {
            labels: {
              format: "{substr value 0 1}",
            },
          },
        },
      },
    ],
  },
};




function App() {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  return (
    <div className="">
      <div>
      <HighchartsReact
        options={options}
        highcharts={Highcharts}
        ref={chartComponentRef}
        updateArgs={[true, true, true]}
        key={"heatmap-chart"}
      />
      </div>
      <div>
        <p>Projenin kaynak <a href="https://github.com/oguzBatur/heatmap_highcharts" target="_blank">kodu</a></p>
      </div>
    </div>
  );
}

export default App;
