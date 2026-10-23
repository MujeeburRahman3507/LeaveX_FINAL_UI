import {
  useEffect,
  useState
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

import adminService
from "../services/adminService";

export default function CountryEmployeeChart() {

  const [data,
    setData] =
    useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const response =
          await adminService
            .getCountryStats();

        setData(
          response.data.data
        );

      } catch(error) {

        console.error(error);

      }
    };

  const colors = [
    "#7C3AED",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#EC4899"
  ];

  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >

      <h2
        className="
        text-xl
        font-bold
        mb-6
        "
      >
        Employees By Country
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="countryName"
          />

          <YAxis
            allowDecimals={false}
          />

          <Tooltip />

          <Bar
            dataKey="employeeCount"
            radius={[8,8,0,0]}
          >

            {
              data.map(
                (entry,index)=>(

                  <Cell
                    key={index}
                    fill={
                      colors[
                        index %
                        colors.length
                      ]
                    }
                  />

                ))
            }

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}