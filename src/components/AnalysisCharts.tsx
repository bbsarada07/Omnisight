import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Cell
} from 'recharts';

const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const REGION_DATA = [
  { name: 'North', value: 2400 },
  { name: 'South', value: 4567 },
  { name: 'East', value: 1398 },
  { name: 'West', value: 3800 },
  { name: 'Central', value: 4300 },
];

const METRIC_DATA = [
  { subject: 'Retention', A: 120, fullMark: 150 },
  { subject: 'Satisfaction', A: 98, fullMark: 150 },
  { subject: 'Reliability', A: 86, fullMark: 150 },
  { subject: 'UX', A: 99, fullMark: 150 },
  { subject: 'Speed', A: 85, fullMark: 150 },
  { subject: 'Support', A: 65, fullMark: 150 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={REVENUE_DATA}>
      <defs>
        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#6366f1" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorVal)" 
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const RegionChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={REGION_DATA}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar 
        dataKey="value" 
        fill="#10b981" 
        radius={[4, 4, 0, 0]}
        barSize={40}
      >
        {REGION_DATA.map((_, index) => (
          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#6366f1'} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export const MetricsChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={METRIC_DATA}>
      <PolarGrid stroke="#333" />
      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
      <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#333" tick={false} />
      <Radar
        name="Performance"
        dataKey="A"
        stroke="#6366f1"
        fill="#6366f1"
        fillOpacity={0.6}
      />
      <Tooltip content={<CustomTooltip />} />
    </RadarChart>
  </ResponsiveContainer>
);
