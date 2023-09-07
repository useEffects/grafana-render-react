import React, { ReactNode } from "react";
import { tw } from "twind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import * as grafanaRuntime from '@grafana/runtime';
let data, width, height
let render = (props: any) => { }

type infoBoxData = {
  sampleMode: string | null;
  header: string | null;
  status: number | null;
  alarms: number | null;
  dayTotal: number | null;
  shiftTotal: (number | null | string)[];
  partNo: number | string | null;
  dieNo: number | string | null;
  sp: number | null | string;
  pv: number | null | string;
};

type infoBoxQueryData = {
  uptime: number | null;
  unplannedDT: number | null;
  plannedDT: number | null;
};

type infoBoxProps = infoBoxData & infoBoxQueryData & { machineNo: number; mode: string };

const prepareData = (
  i: number,
  data: {
    elementName: string;
    value: {
      status: number;
      timestamp: string;
      value: number | string | null;
      numsAlarmsActive?: number;
    };
  }[]
): infoBoxData => {
  const elementNames = {
    sampleMode: `Adroit.Digital.PNA_CAS_LPC${i}_SAMPLE_MODE`,
    header: `PNA.String.PNA_CAS_LPC${i}_ARTICLE_CUST`,
    status: `Adroit.Digital.PNA_CAS_LPC${i}_RUNNING`,
    alarms: `Adroit.AlarmList.PNA_CAS_LPC${i}_ALARMS`,
    shift1: `PNA.Integer.PNA_CAS_LPC${i}_CAST_SCORE_S1`,
    shift2: `PNA.Integer.PNA_CAS_LPC${i}_CAST_SCORE_S2`,
    shift3: `PNA.Integer.PNA_CAS_LPC${i}_CAST_SCORE_S3`,
    dieNo: `PNA.Integer.PNA_CAS_LPC${i}_MOLD_NUMBER`,
    partNo: `PNA.Integer.PNA CAS_LPC${i}_ARTICLE_NUMBER`,
    sp: `PNA.Real.PNA_CAS_LPC${i}_SP`,
    pv: `PNA.Real.PNA_CAS_LPC${i}_PV`,
  };
  const info = data.reduce<infoBoxData>(
    (res, { elementName, value }) => {
      switch (elementName) {
        case elementNames.sampleMode:
          return { ...res, sampleMode: String(value.value) };
        case elementNames.header:
          return { ...res, header: String(value.value) };
        case elementNames.status:
          return { ...res, status: value.value === "true" ? 1 : 0 };
        case elementNames.alarms:
          return { ...res, alarms: value.numsAlarmsActive !== undefined ? Number(value.numsAlarmsActive) : 0 };
        case elementNames.dieNo:
          return { ...res, dieNo: value.status === 1 ? Number(value.value) : value.value };
        case elementNames.partNo:
          return { ...res, partNo: value.status === 1 ? Number(value.value) : value.value };
        case elementNames.shift1:
          res.shiftTotal[0] = value.status === 1 ? Number(value.value) : value.value;
          return res;
        case elementNames.shift2:
          res.shiftTotal[1] = value.status === 1 ? Number(value.value) : value.value;
          return res;
        case elementNames.shift3:
          res.shiftTotal[2] = value.status === 1 ? Number(value.value) : value.value;
          return res;
        case elementNames.sp:
          return { ...res, sp: value.status === 1 ? Number(value.value) : value.value };
        case elementNames.pv:
          return { ...res, pv: value.status === 1 ? Number(value.value) : value.value };
        default:
          break;
      }
      return res;
    },
    {
      sampleMode: null,
      header: null,
      status: null,
      alarms: null,
      dayTotal: null,
      shiftTotal: [0, 0, 0],
      partNo: null,
      dieNo: null,
      sp: null,
      pv: null,
    }
  );
  info.dayTotal = info.shiftTotal.reduce((a: number, b) => a + (b ? Number(b) : 0), 0) as number;
  return info;
};

const Box = ({ children, className, prefix }: { children: ReactNode; className: string; prefix?: ReactNode }) => <div className={tw`${className} p-2 flex justify-between`}>
  <span> {prefix} </span>
  <p> {children} </p>
</div>;

const InfoBox = ({ sampleMode, header, status, alarms, dayTotal, shiftTotal, partNo, dieNo, machineNo, mode, uptime, unplannedDT, plannedDT, sp, pv }: infoBoxData & { machineNo: number; mode: string } & infoBoxQueryData) => {
  return (
    <div className={tw`w-[250px] ${mode.toLowerCase() === "simple" ? "h-[300px]" : "h-[500px]"} bg-blue-300 gap-1 flex flex-col justify-between [&>*]:my-0 text-black text-sm`}>
      {sampleMode && <Box className={tw`bg-yellow-300 my-0`}> Sample Mode On </Box>}
      <div className={tw`cursor-pointer`} onClick={() => {
        window.open(`https://pna-grafana.maxionwheels.com:3000/d/6PhjGteVz/viewer?orgId=1&var-machine=LPC${machineNo}`, '_blank');
      }}>
        <Box className={tw`bg-blue-400 p-2 my-0`}>{`LPC${machineNo} - ${header ?? "N/A"}`}</Box>
      </div>

      <div className={tw`flex gap-2 px-2 m-0`}>
        <div className={tw`w-1/2`}>
          <Box prefix={<FontAwesomeIcon icon={icons.faCircleInfo} />} className={tw`bg-green-300 my-0 ${status === 1 ? "bg-green-400" : "bg-red-400"}`}> {status === 1 ? "running" : "stopped"} </Box>
        </div>
        <div className={tw`w-1/2`}>
          <Box prefix={<FontAwesomeIcon icon={icons.faBell} />} className={tw`my-0 ${alarms !== 0 ? "bg-red-400" : "bg-white"}`}> {alarms ?? "N/A"} </Box>
        </div>
      </div>
      <div className={tw`flex gap-2 px-2 m-0`}>
        <div className={tw`w-1/2`}>
          <Box prefix={<FontAwesomeIcon icon={icons.faCalculator} />} className={tw`bg-white my-0`}> {dayTotal ?? "N/A"} </Box>
        </div>
        <div className={tw`w-1/2`}>
          <Box prefix={<FontAwesomeIcon icon={icons.faChartColumn} />} className={tw`bg-white my-0`}> {shiftTotal.join(" ")} </Box>
        </div>
      </div>
      <div className={tw`flex gap-2 px-2 m-0`}>
        <div className={tw`w-1/2`}>
          <Box prefix={"Part No"} className={tw`bg-white my-0`}> {partNo ?? "N/A"} </Box>
        </div>
        <div className={tw`w-1/2`}>
          <Box prefix={"Die No"} className={tw`bg-white my-0`}> {dieNo ?? "N/A"} </Box>
        </div>
      </div>
      <Box className={tw`bg-green-300`}> Unplanned DT </Box>
      {mode.toLowerCase() === "advanced" && (
        <>
          <div className={tw`flex px-2`}>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0`}> Metal SP: </Box>
            </div>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0 bg-white`}> {sp ?? "N/A"} </Box>
            </div>
          </div>
          <div className={tw`flex px-2`}>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0`}> Metal PV: </Box>
            </div>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0 bg-white`}> {pv ?? "N/A"} </Box>
            </div>
          </div>
          <div className={tw`flex px-2`}>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0`}> Uptime </Box>
            </div>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0 bg-white`}> {uptime ?? "N/A"} </Box>
            </div>
          </div>
          <div className={tw`flex px-2`}>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0`}> UnPlanned DT: </Box>
            </div>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0 bg-white`}> {unplannedDT ?? "N/A"} </Box>
            </div>
          </div>
          <div className={tw`flex px-2`}>
            <div className={tw`w-1/2`}>
              <Box className={tw`my-0`}> Planned DT: </Box>
            </div>
            <div className={tw`w-1/2 mb-2`}>
              <Box className={tw`my-0 bg-white`}> {plannedDT ?? "N/A"} </Box>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function App() {
  console.log(data)
  const { getTemplateSrv } = grafanaRuntime;
  const mode = React.useMemo(() => getTemplateSrv().replace("$infoBox"), [getTemplateSrv().replace("$infoBox")]);
  const [dataProps, setDataProps] = React.useState<infoBoxProps[]>([]);
  React.useEffect(() => {
    let _infoBoxData: infoBoxData;
    data.series.forEach(({ fields, name, refId }) => {
      if (!refId?.includes("SQL Server")) {
        const dataObtained = JSON.parse((fields[0].values as any).buffer[0]);
        const preparedData = prepareData(parseInt(name ?? "0"), dataObtained);
        _infoBoxData = preparedData;
      } else {
        // TODO: SQL Server data
      }
      setDataProps((prev) => [...prev, { ..._infoBoxData, machineNo: parseInt(name ?? "0"), mode, uptime: null, unplannedDT: null, plannedDT: null }]);
    });
  }, [mode]);
  return (
    <div style={{ width, height }} className={tw`flex flex-wrap gap-2 p-2 bg-blue-100 justify-center`}>
      {data.state !== "Done" ? (
        <div className={tw`w-full h-full flex justify-center items-center`}>
          <p className={tw`text-center`}> {data.state} </p>
        </div>
      ) : (
        <>
          {dataProps.map((dataProp, i) => (
            <InfoBox key={i} {...dataProp} />
          ))}
        </>
      )}
    </div>
  );
}

render(<App />);