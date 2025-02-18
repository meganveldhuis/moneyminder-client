import "./SumPieChart.scss";
import { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Sector, Legend } from "recharts";
import APIService from "../../services/APIService";

function SumPieChart({ filters }) {
  const [piData, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name} ${value}$`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  async function getData() {
    const response = await APIService.getExpensesByCategory(
      filters.yearFilter,
      filters.monthFilter
    );
    if (response) {
      const parsedData = response.map((line) => {
        return {
          name: line.category_name,
          value: Number(line.total),
        };
      });
      setData(parsedData);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    getData();
  }, [filters]);

  function handleMouseEnter(_, index) {
    setActiveIndex(index);
  }
  return (
    <>
      {piData.length !== 0 ? (
        <PieChart className="pie-chart" width={400} height={400}>
          <Legend className="pie-chart__legend" />
          <Pie
            className="pie-chart__pie"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={piData}
            cx="50%"
            cy="50%"
            outerRadius={50}
            innerRadius={20}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={handleMouseEnter}
          />
        </PieChart>
      ) : (
        <p className="pie-chart__warning">
          No data to display within these filters
        </p>
      )}
    </>
  );
}

export default SumPieChart;
