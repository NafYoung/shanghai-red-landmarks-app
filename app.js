const SHANGHAI_CENTER = [31.23234, 121.46918];
const SHANGHAI_ZOOM = 11;
const URL_VERSION = "1";
const ROUTE_START_MINUTE = 9 * 60 + 30;
const ROUTE_FETCH_TIMEOUT_MS = 5500;
const REAL_ROUTE_ENGINE_URL = "https://router.project-osrm.org";
const AMAP_DRIVING_API_URL = "https://restapi.amap.com/v3/direction/driving";
const BAIDU_PANORAMA_IMAGE_URL = "https://api.map.baidu.com/panorama/v2";
const SHANGHAI_BOUNDARY_GEOJSON_URL = "./data/shanghai-boundary.simple.geojson";
const PANORAMA_INDEX_URL = "./data/panoramas.json";
const SHANGHAI_FALLBACK_BOUNDS = [
  [30.66, 120.85],
  [31.9, 122.18]
];
const SEARCH_INPUT_DEBOUNCE_MS = 180;
const TRAVEL_MODEL_STORAGE_KEY = "shanghai-red-landmarks-travel-model-v1";
const TRAVEL_MODEL_UPDATE_DEBOUNCE_MS = 180;
const ROUTE_CACHE_STORAGE_KEY = "shanghai-red-landmarks-drive-traffic-v1";
const ROUTE_CACHE_DRIVE_REALTIME_TTL_MS = 5 * 60 * 1000;
const ROUTE_CACHE_MODEL_TTL_MS = 24 * 60 * 60 * 1000;
const ROUTE_CACHE_MAX_ENTRIES = 300;
const ROUTE_CACHE_PERSIST_DEBOUNCE_MS = 220;
const PANORAMA_PREF_STORAGE_KEY = "shanghai-red-landmarks-panorama-pref-v1";
const SCENE_MODE_DEFAULT = "panorama";
const ROUTE_MODEL_BIKE_SPEED_KMH = 13.5;
const ROUTE_MODEL_BIKE_BUFFER_MINUTES = 3;
const ROUTE_MODEL_DRIVE_BASE_MINUTES = 8;
const ROUTE_MODEL_DRIVE_CONGESTION_FACTOR = 1.18;
const TRAVEL_MODEL_DEFAULTS = Object.freeze({
  walkingSpeedKmh: 4.8,
  walkingTransferBufferMinutes: 2,
  metroSpeedKmh: 26,
  metroTransferBufferMinutes: 14,
  metroWalkSpeedKmh: 23,
  metroWalkTransferBufferMinutes: 16,
  taxiSpeedKmh: 30,
  taxiTransferBufferMinutes: 10,
  taxiEngineMinFactor: 1.35,
  taxiEngineExtraMinutes: 4
});
const TRAVEL_MODEL_FIELDS = [
  { key: "walkingSpeedKmh", inputId: "tmWalkingSpeed", min: 3, max: 8, step: 0.1 },
  { key: "walkingTransferBufferMinutes", inputId: "tmWalkingBuffer", min: 0, max: 30, step: 1 },
  { key: "metroSpeedKmh", inputId: "tmMetroSpeed", min: 10, max: 45, step: 1 },
  { key: "metroTransferBufferMinutes", inputId: "tmMetroBuffer", min: 0, max: 40, step: 1 },
  { key: "metroWalkSpeedKmh", inputId: "tmMetroWalkSpeed", min: 10, max: 40, step: 1 },
  { key: "metroWalkTransferBufferMinutes", inputId: "tmMetroWalkBuffer", min: 0, max: 45, step: 1 },
  { key: "taxiSpeedKmh", inputId: "tmTaxiSpeed", min: 12, max: 60, step: 1 },
  { key: "taxiTransferBufferMinutes", inputId: "tmTaxiBuffer", min: 0, max: 35, step: 1 },
  { key: "taxiEngineMinFactor", inputId: "tmTaxiFactor", min: 1, max: 3, step: 0.05 },
  { key: "taxiEngineExtraMinutes", inputId: "tmTaxiExtra", min: 0, max: 20, step: 1 }
];
const POSTER_MODAL_FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const RUNTIME_CONFIG = window.RUNTIME_CONFIG && typeof window.RUNTIME_CONFIG === "object"
  ? window.RUNTIME_CONFIG
  : {};
const AMAP_WEB_SERVICE_KEY = typeof RUNTIME_CONFIG.amapKey === "string"
  ? RUNTIME_CONFIG.amapKey.trim()
  : "";
const BAIDU_AK = typeof RUNTIME_CONFIG.baiduAk === "string" ? RUNTIME_CONFIG.baiduAk.trim() : "";
const STOP_TIME_BY_TYPE = {
  中共会址: 70,
  抗战遗址: 80,
  烈士纪念: 75,
  人物纪念: 60,
  展陈场馆: 55
};

const rawScenicSpots = [
  {
    id: "sihang",
    name: "四行仓库抗战纪念馆",
    district: "静安区",
    type: "抗战遗址",
    year: 1937,
    lat: 31.24207778,
    lng: 121.46694444,
    address: "静安区光复路21号",
    brief: "展示淞沪会战四行仓库保卫战历史。",
    intro:
      "四行仓库是淞沪会战中著名的保卫战发生地，纪念馆通过实物、影像和场景复原，讲述“八百壮士”坚守阵地的历史，呈现上海城市抗战记忆。",
    keywords: ["八百壮士", "淞沪会战", "抗战"],
    parking: { available: true, name: "光复路停车场", distance: "步行约2分钟", address: "静安区光复路近西藏北路", note: "" }
  },
  {
    id: "site1",
    name: "中共一大会址纪念馆",
    district: "黄浦区",
    type: "中共会址",
    year: 1921,
    lat: 31.2221,
    lng: 121.4707,
    address: "黄浦区兴业路76号（会址）；黄浦区黄陂南路374号（纪念馆）",
    brief: "中国共产党第一次全国代表大会会址。",
    intro:
      "中共一大纪念馆由会址与纪念馆展陈组成。石库门会址见证建党历史，纪念馆系统展示建党背景、一大进程和早期革命活动。",
    keywords: ["建党", "初心", "石库门"],
    parking: { available: true, name: "兴业路停车场", distance: "步行约3分钟", address: "黄浦区兴业路近黄陂南路", note: "节假日车位较紧张" }
  },
  {
    id: "site2",
    name: "中共二大会址纪念馆",
    district: "静安区",
    type: "中共会址",
    year: 1922,
    lat: 31.2261,
    lng: 121.4622,
    address: "静安区老成都北路7弄30号",
    brief: "首部党章诞生地，见证早期党组织建设。",
    intro:
      "中共二大会址重点呈现中国共产党第一部党章的诞生过程。展陈围绕党纲完善、组织建设和工人运动实践，体现早期建党探索。",
    keywords: ["党章", "早期党史"],
    parking: { available: true, name: "老成都北路停车场", distance: "步行约4分钟", address: "静安区老成都北路近延安中路", note: "" }
  },
  {
    id: "site4",
    name: "中共四大纪念馆",
    district: "虹口区",
    type: "中共会址",
    year: 1925,
    lat: 31.2571553,
    lng: 121.4804129,
    address: "虹口区四川北路1468号（四川北路公园内）",
    brief: "展示中共四大历史贡献与统一战线思想。",
    intro:
      "中共四大纪念馆围绕党的组织路线和群众路线建设，展示会议的历史贡献。常设展强调工农联盟、统一战线和基层组织发展。",
    keywords: ["统一战线", "党史"],
    parking: { available: true, name: "四川北路公园停车场", distance: "步行约2分钟", address: "虹口区四川北路1468号公园内", note: "车位较少，建议公共交通" }
  },
  {
    id: "longhua",
    name: "龙华烈士陵园",
    district: "徐汇区",
    type: "烈士纪念",
    year: 1949,
    lat: 31.1776591,
    lng: 121.4442664,
    address: "徐汇区龙华西路180号",
    brief: "上海重要烈士纪念场所，含纪念馆与纪念碑。",
    intro:
      "龙华烈士陵园集纪念、教育与瞻仰功能于一体，集中纪念在革命和建设时期牺牲的英烈。园区内纪念馆展陈完整，仪式感强。",
    keywords: ["烈士", "纪念"],
    parking: { available: true, name: "龙华烈士陵园停车场", distance: "园区内", address: "徐汇区龙华西路180号院内", note: "免费停车" }
  },
  {
    id: "songhu",
    name: "上海淞沪抗战纪念馆",
    district: "宝山区",
    type: "抗战遗址",
    year: 1937,
    lat: 31.4117365,
    lng: 121.4904388,
    address: "宝山区友谊路1号（临江公园内）",
    brief: "系统呈现淞沪抗战史实与城市抗战记忆。",
    intro:
      "上海淞沪抗战纪念馆以淞沪会战为主线，结合文物、档案和多媒体展项还原战场形势，突出上海在全国抗战中的战略地位。",
    keywords: ["淞沪抗战", "抗日"],
    parking: { available: true, name: "临江公园停车场", distance: "步行约3分钟", address: "宝山区友谊路1号临江公园旁", note: "" }
  },
  {
    id: "anthem",
    name: "国歌展示馆",
    district: "杨浦区",
    type: "展陈场馆",
    year: 1935,
    lat: 31.26026,
    lng: 121.50973,
    address: "杨浦区荆州路151号",
    brief: "围绕《义勇军进行曲》创作与传播历史展陈。",
    intro:
      "国歌展示馆聚焦《义勇军进行曲》的诞生、传播与时代影响，结合声像资料和历史文献，展现国歌背后的民族抗争精神。",
    keywords: ["义勇军进行曲", "聂耳", "田汉"],
    parking: { available: true, name: "荆州路停车场", distance: "步行约5分钟", address: "杨浦区荆州路近大连路", note: "路边咪表车位为主" }
  },
  {
    id: "luxun",
    name: "上海鲁迅纪念馆",
    district: "虹口区",
    type: "人物纪念",
    year: 1936,
    lat: 31.2716807,
    lng: 121.4793996,
    address: "虹口区甜爱路200号",
    brief: "展示鲁迅生平与革命文化精神。",
    intro:
      "纪念馆通过手稿、藏书和历史照片，展示鲁迅在上海时期的创作与社会活动。内容强调左翼文化运动与思想启蒙价值。",
    keywords: ["鲁迅", "左翼文化"],
    parking: { available: true, name: "鲁迅公园停车场", distance: "步行约3分钟", address: "虹口区甜爱路近四川北路", note: "" }
  },
  {
    id: "soong",
    name: "宋庆龄故居纪念馆",
    district: "徐汇区",
    type: "人物纪念",
    year: 1949,
    lat: 31.2057687,
    lng: 121.4344177,
    address: "徐汇区淮海中路1843号",
    brief: "呈现宋庆龄在上海工作与生活历史。",
    intro:
      "宋庆龄故居保留了其在沪生活与办公空间，展陈涵盖新中国成立前后重要历史节点，体现其在统一战线和社会事业中的贡献。",
    keywords: ["宋庆龄", "名人故居"],
    parking: { available: true, name: "淮海中路停车场", distance: "步行约4分钟", address: "徐汇区淮海中路近武康路", note: "收费停车" }
  },
  {
    id: "cy",
    name: "陈云纪念馆",
    district: "青浦区",
    type: "人物纪念",
    year: 1905,
    lat: 31.0089868,
    lng: 121.0392608,
    address: "青浦区练塘镇朱枫公路3516号",
    brief: "展示陈云同志生平与党史贡献。",
    intro:
      "陈云纪念馆位于其故里练塘，展览从革命经历、经济建设到党风建设多维度呈现其思想与实践，是重要党史教育基地。",
    keywords: ["陈云", "青浦"],
    parking: { available: true, name: "陈云纪念馆停车场", distance: "馆区内", address: "青浦区练塘镇朱枫公路3516号院内", note: "免费停车，车位充足" }
  },
  {
    id: "youth",
    name: "团中央机关旧址纪念馆",
    district: "黄浦区",
    type: "中共会址",
    year: 1920,
    lat: 31.22194389,
    lng: 121.46361111,
    address: "黄浦区淮海中路567弄1-6号（2号门）",
    brief: "中国社会主义青年团中央机关旧址。",
    intro:
      "该旧址见证了早期青年运动和社会主义青年团的组织建设。展区围绕青年群体的觉醒、传播与行动，呈现城市革命网络形成过程。",
    keywords: ["青年团", "团中央旧址"],
    parking: { available: true, name: "淮海中路公共停车场", distance: "步行约5分钟", address: "黄浦区淮海中路近思南路", note: "周边商圈停车位较紧张" }
  }
];

const SCENE_PRESETS_BY_ID = {
  sihang: { heading: 102, tilt: 74, altitude: 620, anchorOffsetLat: -0.00003, anchorOffsetLng: -0.0002 },
  site1: { heading: 42, tilt: 73, altitude: 520, anchorOffsetLat: 0.00006, anchorOffsetLng: -0.00008 },
  site2: { heading: 26, tilt: 72, altitude: 560, anchorOffsetLat: -0.00004, anchorOffsetLng: -0.00006 },
  site4: { heading: 38, tilt: 71, altitude: 640, anchorOffsetLat: 0.00005, anchorOffsetLng: -0.00008 },
  longhua: { heading: 148, tilt: 69, altitude: 760, anchorOffsetLat: 0.00006, anchorOffsetLng: -0.00003 },
  songhu: { heading: 126, tilt: 68, altitude: 940, anchorOffsetLat: -0.00008, anchorOffsetLng: -0.0001 },
  anthem: { heading: 66, tilt: 72, altitude: 650, anchorOffsetLat: -0.00003, anchorOffsetLng: -0.00004 },
  luxun: { heading: 54, tilt: 71, altitude: 640, anchorOffsetLat: 0.00005, anchorOffsetLng: -0.00005 },
  soong: { heading: 34, tilt: 72, altitude: 620, anchorOffsetLat: 0.00007, anchorOffsetLng: -0.00004 },
  cy: { heading: 118, tilt: 68, altitude: 980, anchorOffsetLat: -0.00004, anchorOffsetLng: -0.00003 },
  youth: { heading: 44, tilt: 73, altitude: 560, anchorOffsetLat: 0.00004, anchorOffsetLng: -0.00005 }
};

const scenicSpots = rawScenicSpots.map((spot) => ({
  ...spot,
  mapLat: spot.lat,
  mapLng: spot.lng,
  scene: {
    heading: 36,
    tilt: 72,
    altitude: 900,
    anchorOffsetLat: 0,
    anchorOffsetLng: 0,
    ...(SCENE_PRESETS_BY_ID[spot.id] || {})
  }
}));

const recommendedRoutes = [
  {
    id: "founding-line",
    title: "建党初心线",
    description: "从团中央旧址到中共一大、二大、四大，串联建党早期历史坐标。",
    spotIds: ["youth", "site1", "site2", "site4"]
  },
  {
    id: "war-line",
    title: "抗战记忆线",
    description: "聚焦上海抗战关键场景，适合半日到一日参观。",
    spotIds: ["sihang", "songhu", "longhua"]
  },
  {
    id: "city-humanity",
    title: "城市人文线",
    description: "人物纪念与国歌文化串联，兼顾红色历史与城市文化。",
    spotIds: ["soong", "luxun", "anthem"]
  }
];

const state = {
  search: "",
  district: "all",
  type: "all",
  selectedSpotId: null,
  activeRouteId: null,
  active3dSpotId: null,
  sceneMode: SCENE_MODE_DEFAULT
};

const refs = {
  searchInput: document.getElementById("searchInput"),
  districtSelect: document.getElementById("districtSelect"),
  typeSelect: document.getElementById("typeSelect"),
  resetFilters: document.getElementById("resetFilters"),
  focusShanghai: document.getElementById("focusShanghai"),
  shareApp: document.getElementById("shareApp"),
  makePoster: document.getElementById("makePoster"),
  shareHint: document.getElementById("shareHint"),
  clearRoute: document.getElementById("clearRoute"),
  routeDataHint: document.getElementById("routeDataHint"),
  totalCount: document.getElementById("totalCount"),
  districtCount: document.getElementById("districtCount"),
  earliestYear: document.getElementById("earliestYear"),
  routeDistance: document.getElementById("routeDistance"),
  scenicList: document.getElementById("scenicList"),
  resultHint: document.getElementById("resultHint"),
  timeline: document.getElementById("timeline"),
  routeCards: document.getElementById("routeCards"),
  routePlan: document.getElementById("routePlan"),
  mapSpotInfo: document.getElementById("mapSpotInfo"),
  sceneModePanorama: document.getElementById("sceneModePanorama"),
  sceneMode3d: document.getElementById("sceneMode3d"),
  scene3dTitle: document.getElementById("scene3dTitle"),
  scene3dMeta: document.getElementById("scene3dMeta"),
  sceneFallbackNotice: document.getElementById("sceneFallbackNotice"),
  scenePanorama: document.getElementById("scenePanorama"),
  scenePanoramaImage: document.getElementById("scenePanoramaImage"),
  scenePanoramaMeta: document.getElementById("scenePanoramaMeta"),
  scene3dHint: document.getElementById("scene3dHint"),
  posterModal: document.getElementById("posterModal"),
  posterCanvas: document.getElementById("posterCanvas"),
  closePoster: document.getElementById("closePoster"),
  downloadPoster: document.getElementById("downloadPoster"),
  copyPosterLink: document.getElementById("copyPosterLink"),
  posterHint: document.getElementById("posterHint"),
  travelModelPanel: document.getElementById("travelModelPanel"),
  travelModelHint: document.getElementById("travelModelHint"),
  resetTravelModel: document.getElementById("resetTravelModel"),
  travelModelInputs: Array.from(document.querySelectorAll("[data-travel-model-key]"))
};

let map = null;
let mapReady = false;
let pendingMapView = null;
let mapMoveEndBound = false;
let routeLayer = null;
let mapMarkerIcon = null;
let shanghaiBoundaryBounds = null;
let shanghaiBoundaryMaskLayer = null;
let shanghaiBoundaryOutlineLayer = null;
let shanghaiMinZoom = 9;
const markerById = new Map();
const scenicById = new Map(scenicSpots.map((spot) => [spot.id, spot]));
let scene3d = null;
let scene3dGraphicsLayer = null;
let scene3dReady = false;
let pending3dSpotId = null;
let scene3dRequestSeq = 0;
let sceneRenderRequestSeq = 0;
let buildingsLayerView = null;
let buildingsHighlightHandle = null;
let panoramaIndexLoaded = false;
let panoramaIndexLoadingPromise = null;
const panoramaBySpotId = new Map();
const routeLegMetricsCache = new Map();
const routeLegMetricsInFlight = new Set();
const travelModel = { ...TRAVEL_MODEL_DEFAULTS };
let routeMetricsLoading = false;
let routeMetricsStatusNote = "";
let routeMetricsRequestSeq = 0;
let lastRouteMetricsRouteId = null;
let searchInputDebounceTimer = null;
let routeCachePersistTimer = null;
let travelModelUpdateTimer = null;
let lastFocusedElementBeforePosterModal = null;

loadTravelModelFromStorage();
loadSceneModePreferenceFromStorage();
loadRouteMetricsCacheFromStorage();
initSelects();
hydrateStateFromUrl();
renderRouteCards();
syncTravelModelControlValues();
bindEvents();
syncControlValues();
syncSceneModeUi();
showShareProtocolHint();
initMap();
initScene3D();
loadPanoramaIndex();
updateView();

function initSelects() {
  const districts = [...new Set(scenicSpots.map((spot) => spot.district))].sort();
  const types = [...new Set(scenicSpots.map((spot) => spot.type))].sort();

  districts.forEach((district) => {
    refs.districtSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${district}">${district}</option>`
    );
  });

  types.forEach((type) => {
    refs.typeSelect.insertAdjacentHTML("beforeend", `<option value="${type}">${type}</option>`);
  });
}

function bindEvents() {
  refs.searchInput.addEventListener("input", () => {
    clearSearchInputDebounce();
    searchInputDebounceTimer = window.setTimeout(() => {
      searchInputDebounceTimer = null;
      state.search = refs.searchInput.value.trim();
      updateView();
    }, SEARCH_INPUT_DEBOUNCE_MS);
  });

  refs.districtSelect.addEventListener("change", (event) => {
    syncSearchStateFromInput();
    state.district = event.target.value;
    updateView();
  });

  refs.typeSelect.addEventListener("change", (event) => {
    syncSearchStateFromInput();
    state.type = event.target.value;
    updateView();
  });

  refs.resetFilters.addEventListener("click", () => {
    clearSearchInputDebounce();
    state.search = "";
    state.district = "all";
    state.type = "all";
    state.selectedSpotId = null;

    refs.searchInput.value = "";
    refs.districtSelect.value = "all";
    refs.typeSelect.value = "all";
    updateView();
  });

  refs.focusShanghai.addEventListener("click", () => {
    fitMapToShanghaiBounds(true);
  });

  if (refs.sceneModePanorama) {
    refs.sceneModePanorama.addEventListener("click", () => {
      if (state.sceneMode === "panorama") {
        return;
      }
      setSceneMode("panorama", {
        persistPreference: true,
        refreshActiveSpot: true
      });
    });
  }

  if (refs.sceneMode3d) {
    refs.sceneMode3d.addEventListener("click", () => {
      if (state.sceneMode === "scene3d") {
        return;
      }
      setSceneMode("scene3d", {
        persistPreference: true,
        refreshActiveSpot: true
      });
    });
  }

  refs.shareApp.addEventListener("click", async () => {
    await shareCurrentView();
  });

  if (refs.makePoster) {
    refs.makePoster.addEventListener("click", async () => {
      await openPosterModal();
    });
  }

  refs.clearRoute.addEventListener("click", () => {
    syncSearchStateFromInput();
    state.activeRouteId = null;
    updateView();
  });

  if (refs.closePoster) {
    refs.closePoster.addEventListener("click", () => {
      closePosterModal();
    });
  }

  if (refs.posterModal) {
    refs.posterModal.addEventListener("click", (event) => {
      if (event.target === refs.posterModal) {
        closePosterModal();
      }
    });

    refs.posterModal.addEventListener("keydown", handlePosterModalKeydown);
  }

  if (refs.downloadPoster) {
    refs.downloadPoster.addEventListener("click", () => {
      downloadPosterImage();
    });
  }

  if (refs.copyPosterLink) {
    refs.copyPosterLink.addEventListener("click", async () => {
      const shareUrl = buildShareUrl();
      if (!shareUrl) {
        setPosterHint("当前是本地文件模式，无法生成可转发链接。");
        return;
      }

      try {
        await navigator.clipboard.writeText(shareUrl);
        setPosterHint("链接已复制，可直接发给朋友。");
      } catch (error) {
        if (fallbackCopyText(shareUrl)) {
          setPosterHint("链接已复制，可直接发给朋友。");
        } else {
          setPosterHint("复制失败，请手动复制地址栏链接。");
        }
      }
    });
  }

  if (refs.resetTravelModel) {
    refs.resetTravelModel.addEventListener("click", () => {
      applyTravelModel(TRAVEL_MODEL_DEFAULTS, "已恢复默认交通估时参数。");
    });
  }

  refs.travelModelInputs.forEach((input) => {
    input.addEventListener("input", () => {
      scheduleTravelModelUpdate();
    });

    input.addEventListener("change", () => {
      scheduleTravelModelUpdate(true);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && refs.posterModal && !refs.posterModal.hidden) {
      closePosterModal();
    }
  });

  window.addEventListener("beforeunload", () => {
    clearSearchInputDebounce();
    if (routeCachePersistTimer) {
      clearTimeout(routeCachePersistTimer);
      routeCachePersistTimer = null;
    }
    if (travelModelUpdateTimer) {
      clearTimeout(travelModelUpdateTimer);
      travelModelUpdateTimer = null;
    }
    persistTravelModelToStorage();
    persistRouteMetricsCacheToStorage();
  });

  bindMapMoveEnd();
}

function clearSearchInputDebounce() {
  if (!searchInputDebounceTimer) {
    return;
  }

  clearTimeout(searchInputDebounceTimer);
  searchInputDebounceTimer = null;
}

function syncSearchStateFromInput() {
  clearSearchInputDebounce();
  state.search = refs.searchInput.value.trim();
}

function normalizeSceneMode(mode) {
  return mode === "scene3d" ? "scene3d" : "panorama";
}

function loadSceneModePreferenceFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    const stored = window.localStorage.getItem(PANORAMA_PREF_STORAGE_KEY);
    if (!stored) {
      return;
    }
    state.sceneMode = normalizeSceneMode(stored.trim());
  } catch (error) {
    // localStorage 可能不可用（如隐私模式），这里静默降级。
  }
}

function persistSceneModePreferenceToStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(PANORAMA_PREF_STORAGE_KEY, state.sceneMode);
  } catch (error) {
    // localStorage 可能不可用（如隐私模式），这里静默降级。
  }
}

function syncSceneModeUi() {
  const isPanorama = state.sceneMode === "panorama";

  if (refs.sceneModePanorama) {
    refs.sceneModePanorama.classList.toggle("active", isPanorama);
    refs.sceneModePanorama.setAttribute("aria-pressed", isPanorama ? "true" : "false");
  }

  if (refs.sceneMode3d) {
    refs.sceneMode3d.classList.toggle("active", !isPanorama);
    refs.sceneMode3d.setAttribute("aria-pressed", !isPanorama ? "true" : "false");
  }

  if (refs.scenePanorama) {
    refs.scenePanorama.hidden = !isPanorama;
  }

  const scene3dEl = document.getElementById("scene3d");
  if (scene3dEl) {
    scene3dEl.hidden = isPanorama;
  }

  if (!isPanorama && scene3d && typeof scene3d.resize === "function") {
    scene3d.resize();
  }
}

function setSceneFallbackNotice(message) {
  if (!refs.sceneFallbackNotice) {
    return;
  }
  refs.sceneFallbackNotice.textContent = message || "";
}

function setSceneMode(mode, options = {}) {
  const nextMode = normalizeSceneMode(mode);
  if (state.sceneMode !== nextMode) {
    state.sceneMode = nextMode;
  }

  syncSceneModeUi();
  if (options.persistPreference) {
    persistSceneModePreferenceToStorage();
  }

  if (options.refreshActiveSpot) {
    const spotId = state.selectedSpotId || state.active3dSpotId || getFilteredSpots()[0]?.id || null;
    if (spotId) {
      updateSpotSceneById(spotId);
    } else {
      resetScene3D();
    }
  }

  syncUrlState();
}

function getTravelModelFieldConfigByKey(key) {
  return TRAVEL_MODEL_FIELDS.find((field) => field.key === key) || null;
}

function clampTravelModelValue(key, value) {
  const config = getTravelModelFieldConfigByKey(key);
  if (!config) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const clamped = Math.min(config.max, Math.max(config.min, parsed));
  const decimals = String(config.step).includes(".") ? String(config.step).split(".")[1].length : 0;
  return Number(clamped.toFixed(decimals));
}

function normalizeTravelModel(inputModel) {
  const normalized = {};
  TRAVEL_MODEL_FIELDS.forEach((field) => {
    const candidate = clampTravelModelValue(field.key, inputModel?.[field.key]);
    normalized[field.key] = candidate == null ? TRAVEL_MODEL_DEFAULTS[field.key] : candidate;
  });
  return normalized;
}

function persistTravelModelToStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(TRAVEL_MODEL_STORAGE_KEY, JSON.stringify(travelModel));
  } catch (error) {
    // localStorage 可能不可用（如隐私模式），这里静默降级。
  }
}

function loadTravelModelFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  let raw = "";
  try {
    raw = window.localStorage.getItem(TRAVEL_MODEL_STORAGE_KEY) || "";
  } catch (error) {
    return;
  }

  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    Object.assign(travelModel, normalizeTravelModel(parsed));
  } catch (error) {
    try {
      window.localStorage.removeItem(TRAVEL_MODEL_STORAGE_KEY);
    } catch (ignored) {}
  }
}

function syncTravelModelControlValues() {
  refs.travelModelInputs.forEach((input) => {
    const key = input.dataset.travelModelKey;
    if (!key || !Object.prototype.hasOwnProperty.call(travelModel, key)) {
      return;
    }
    input.value = String(travelModel[key]);
  });
}

function setTravelModelHint(message) {
  if (!refs.travelModelHint) {
    return;
  }
  refs.travelModelHint.textContent = message;
}

function recalculateRouteLegMetricsCacheWithCurrentModel() {
  let changed = false;
  const now = Date.now();

  Array.from(routeLegMetricsCache.entries()).forEach(([cacheKey, metrics]) => {
    if (!metrics || !Number.isFinite(metrics.distanceMeters)) {
      return;
    }

    const stable = getStableModeMinutes(metrics.distanceMeters);
    const keepRealtimeDrive =
      metrics.driveSource === "realtime" &&
      Number.isFinite(metrics.driveExpiresAt) &&
      metrics.driveExpiresAt > now;
    const nextDriveSource = keepRealtimeDrive ? "realtime" : "model";
    const nextDriveMinutes = keepRealtimeDrive
      ? Math.max(1, Math.round(Number(metrics.driveMinutes) || 0))
      : getDriveModelMinutes(metrics.distanceMeters);
    const nextDriveTrafficLevel = keepRealtimeDrive
      ? normalizeDriveTrafficLevel(metrics.driveTrafficLevel)
      : "模型估算";

    if (
      metrics.walkMinutes === stable.walkMinutes &&
      metrics.bikeMinutes === stable.bikeMinutes &&
      metrics.metroMinutes === stable.metroMinutes &&
      metrics.driveMinutes === nextDriveMinutes &&
      metrics.driveSource === nextDriveSource &&
      metrics.driveTrafficLevel === nextDriveTrafficLevel
    ) {
      return;
    }

    routeLegMetricsCache.set(cacheKey, {
      ...metrics,
      walkMinutes: stable.walkMinutes,
      bikeMinutes: stable.bikeMinutes,
      metroMinutes: stable.metroMinutes,
      driveMinutes: nextDriveMinutes,
      driveSource: nextDriveSource,
      driveTrafficLevel: nextDriveTrafficLevel,
      updatedAt: now,
      modelExpiresAt: now + ROUTE_CACHE_MODEL_TTL_MS,
      driveExpiresAt: keepRealtimeDrive ? metrics.driveExpiresAt : now + ROUTE_CACHE_MODEL_TTL_MS,
      expiresAt: Math.max(
        now + ROUTE_CACHE_MODEL_TTL_MS,
        keepRealtimeDrive ? metrics.driveExpiresAt : now + ROUTE_CACHE_MODEL_TTL_MS
      )
    });
    changed = true;
  });

  if (changed) {
    schedulePersistRouteMetricsCache();
  }

  return changed;
}

function applyTravelModel(nextModel, hintMessage) {
  const normalized = normalizeTravelModel(nextModel);
  let changed = false;

  TRAVEL_MODEL_FIELDS.forEach((field) => {
    const key = field.key;
    if (travelModel[key] !== normalized[key]) {
      changed = true;
      travelModel[key] = normalized[key];
    }
  });

  syncTravelModelControlValues();
  persistTravelModelToStorage();

  if (changed) {
    recalculateRouteLegMetricsCacheWithCurrentModel();
    refreshRouteSections();
    setTravelModelHint(hintMessage || "交通估时参数已更新，路线时间已重算。");
    return;
  }

  setTravelModelHint("参数未发生变化。");
}

function applyTravelModelFromInputs() {
  const nextModel = {};
  refs.travelModelInputs.forEach((input) => {
    const key = input.dataset.travelModelKey;
    if (!key) {
      return;
    }
    nextModel[key] = input.value;
  });

  applyTravelModel(nextModel);
}

function scheduleTravelModelUpdate(immediate) {
  if (travelModelUpdateTimer) {
    clearTimeout(travelModelUpdateTimer);
    travelModelUpdateTimer = null;
  }

  if (immediate) {
    applyTravelModelFromInputs();
    return;
  }

  travelModelUpdateTimer = window.setTimeout(() => {
    travelModelUpdateTimer = null;
    applyTravelModelFromInputs();
  }, TRAVEL_MODEL_UPDATE_DEBOUNCE_MS);
}

function getActiveRoute() {
  return recommendedRoutes.find((route) => route.id === state.activeRouteId) || null;
}

function getFilteredSpots() {
  const activeRoute = getActiveRoute();
  const routeSpotSet = activeRoute ? new Set(activeRoute.spotIds) : null;
  const searchQuery = state.search.toLowerCase();

  return scenicSpots.filter((spot) => {
    if (state.district !== "all" && spot.district !== state.district) {
      return false;
    }

    if (state.type !== "all" && spot.type !== state.type) {
      return false;
    }

    if (routeSpotSet && !routeSpotSet.has(spot.id)) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const haystack = [spot.name, spot.brief, spot.intro, spot.address, spot.district, spot.type, ...spot.keywords]
      .join(" ")
      .toLowerCase();

    return haystack.includes(searchQuery);
  });
}

function updateView() {
  const filtered = getFilteredSpots();

  if (state.selectedSpotId && !filtered.some((spot) => spot.id === state.selectedSpotId)) {
    state.selectedSpotId = null;
  }

  renderList(filtered);
  renderMap(filtered);
  renderStats(filtered);
  renderTimeline(filtered);
  renderRouteCards();
  renderRoutePlan();
  renderRouteDataHint();
  syncRouteCardState();
  syncUrlState();
  prefetchActiveRouteMetrics();

  const fallbackSpotId = state.selectedSpotId || filtered[0]?.id || null;
  if (fallbackSpotId) {
    if (state.active3dSpotId !== fallbackSpotId || !scene3dReady) {
      updateSpotSceneById(fallbackSpotId);
    }
    updateMapSpotInfo(scenicById.get(fallbackSpotId) || null);
  } else {
    resetScene3D();
    updateMapSpotInfo(null);
  }
}

function refreshRouteSections() {
  const filtered = getFilteredSpots();
  renderStats(filtered);
  renderRouteCards();
  renderRoutePlan();
  renderRouteDataHint();
  syncRouteCardState();
}

function renderList(spots) {
  refs.scenicList.innerHTML = "";
  refs.resultHint.textContent = `共 ${spots.length} 个结果`;

  if (!spots.length) {
    refs.scenicList.innerHTML = '<p class="scenic-empty">没有匹配结果，请调整筛选条件。</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  spots.forEach((spot) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "scenic-item";
    card.dataset.id = spot.id;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-pressed", state.selectedSpotId === spot.id ? "true" : "false");
    card.setAttribute("aria-label", `${spot.name}，${spot.district}，${spot.type}，按下可地图定位`);

    if (state.selectedSpotId === spot.id) {
      card.classList.add("active");
    }

    const parkingHtml = spot.parking
      ? `<p class="item-parking">\u{1f17f}\ufe0f ${spot.parking.available ? "有停车场" : "无停车场"}：${spot.parking.name}（${spot.parking.distance}）${spot.parking.note ? "｜" + spot.parking.note : ""}</p>`
      : "";

    card.innerHTML = `
      <div class="item-head">
        <h4>${spot.name}</h4>
        <span class="tag">${spot.district}</span>
      </div>
      <p class="item-brief">${spot.brief}</p>
      <p class="item-address">地址：${spot.address}</p>
      ${parkingHtml}
      <p class="item-intro">${spot.intro}</p>
      <div class="item-meta">
        <span class="meta-chip">${spot.type}</span>
        <span class="meta-chip">关联年份 ${spot.year}</span>
      </div>
      <span class="link-btn" aria-hidden="true">地图定位</span>
    `;

    card.addEventListener("click", () => {
      focusSpot(spot.id, true);
    });

    fragment.appendChild(card);
  });

  refs.scenicList.appendChild(fragment);
}

function renderMap(spots) {
  if (!mapReady || typeof window.L === "undefined") {
    return;
  }

  const visibleSpotIds = new Set(spots.map((spot) => spot.id));
  markerById.forEach((marker, spotId) => {
    if (!visibleSpotIds.has(spotId)) {
      marker.remove();
      markerById.delete(spotId);
    }
  });

  if (!mapMarkerIcon) {
    mapMarkerIcon = createMarkerIcon();
  }

  spots.forEach((spot) => {
    const existingMarker = markerById.get(spot.id);
    if (existingMarker) {
      existingMarker.setLatLng([getSpotMapLat(spot), getSpotMapLng(spot)]);
      const popup = existingMarker.getPopup();
      if (popup) {
        popup.setContent(getSpotPopupHtml(spot));
      }
      return;
    }

    const marker = window.L.marker([getSpotMapLat(spot), getSpotMapLng(spot)], { icon: mapMarkerIcon });
    marker.bindPopup(getSpotPopupHtml(spot), {
      className: "spot-popup",
      maxWidth: 320
    });
    marker.on("click", () => {
      state.selectedSpotId = spot.id;
      highlightSelectedCard();
      updateSpotSceneById(spot.id);
      updateMapSpotInfo(spot);
      syncUrlState();
    });
    marker.addTo(map);
    markerById.set(spot.id, marker);
  });

  markerById.forEach((marker, spotId) => {
    if (state.selectedSpotId === spotId) {
      marker.openPopup();
    } else {
      marker.closePopup();
    }
  });

  drawActiveRoute(spots);
}

function drawActiveRoute(filteredSpots) {
  if (!mapReady || typeof window.L === "undefined") {
    return;
  }

  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }

  const activeRoute = getActiveRoute();

  if (!activeRoute) {
    return;
  }

  const visibleSpotIds = new Set(filteredSpots.map((spot) => spot.id));
  const routeSpots = activeRoute.spotIds
    .map((spotId) => scenicById.get(spotId))
    .filter((spot) => spot && visibleSpotIds.has(spot.id));

  if (routeSpots.length < 2) {
    return;
  }

  routeLayer = window.L.polyline(
    routeSpots.map((spot) => [getSpotMapLat(spot), getSpotMapLng(spot)]),
    {
      color: "#b61f15",
      weight: 4,
      opacity: 0.95,
      dashArray: "8 7"
    }
  ).addTo(map);

  fitMapToSpots(routeSpots);
}

function createMarkerIcon() {
  return window.L.divIcon({
    className: "red-marker",
    html: "<span></span>",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -10]
  });
}

function renderStats(spots) {
  refs.totalCount.textContent = String(spots.length);
  refs.districtCount.textContent = String(new Set(spots.map((spot) => spot.district)).size);

  if (!spots.length) {
    refs.earliestYear.textContent = "-";
  } else {
    refs.earliestYear.textContent = String(Math.min(...spots.map((spot) => spot.year)));
  }

  const activeRoute = getActiveRoute();
  if (!activeRoute) {
    refs.routeDistance.textContent = "-";
    return;
  }

  const routeDistance = getRouteDistance(activeRoute);
  refs.routeDistance.textContent = `${routeDistance.toFixed(1)} km`;
}

function renderTimeline(spots) {
  refs.timeline.innerHTML = "";

  if (!spots.length) {
    refs.timeline.innerHTML = '<p class="scenic-empty">暂无时间线数据。</p>';
    return;
  }

  const sorted = [...spots].sort((a, b) => a.year - b.year);
  const fragment = document.createDocumentFragment();

  sorted.forEach((spot) => {
    const item = document.createElement("article");
    item.className = "time-item";
    item.innerHTML = `
      <div class="time-year">${spot.year}</div>
      <div class="time-body">
        <h4>${spot.name}</h4>
        <p>${spot.brief}</p>
      </div>
    `;

    fragment.appendChild(item);
  });

  refs.timeline.appendChild(fragment);
}

function renderRouteCards() {
  refs.routeCards.innerHTML = "";

  recommendedRoutes.forEach((route) => {
    const card = document.createElement("article");
    card.className = "route-card";
    card.dataset.id = route.id;

    const planInfo = getRoutePlanInfo(route);
    const sourceLabel = getPlanSourceLabel(planInfo);
    const recommendedMode = getRouteRecommendedModeFromTotals(planInfo);
    const driveSourceLabel = getDriveSourceSummaryLabel(planInfo);
    card.innerHTML = `
      <h4>${route.title}</h4>
      <p>${route.description}</p>
      <div class="route-modes" aria-label="路线四方式总时长">
        <span class="route-mode-chip">步行：${formatDuration(planInfo.totalWalkMinutes)}<em>模型估算</em></span>
        <span class="route-mode-chip">骑行：${formatDuration(planInfo.totalBikeMinutes)}<em>模型估算</em></span>
        <span class="route-mode-chip">地铁：${formatDuration(planInfo.totalMetroMinutes)}<em>模型估算</em></span>
        <span class="route-mode-chip">驾车：${formatDuration(planInfo.totalDriveMinutes)}<em>${driveSourceLabel}</em></span>
      </div>
      <div class="route-meta">
        <span class="meta-chip">${route.spotIds.length} 个点 · 约 ${planInfo.totalDistanceKm.toFixed(1)} km · 推荐 ${recommendedMode.label} ${formatDuration(planInfo.totalMinutes)} · ${sourceLabel}</span>
        <button class="button" type="button">查看路线</button>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      syncSearchStateFromInput();
      state.activeRouteId = state.activeRouteId === route.id ? null : route.id;
      state.selectedSpotId = null;
      updateView();
    });

    refs.routeCards.appendChild(card);
  });
}

function renderRoutePlan() {
  const activeRoute = getActiveRoute();
  refs.routePlan.innerHTML = "";

  if (!activeRoute) {
    refs.routePlan.innerHTML =
      '<p class="scenic-empty">点击上方“查看路线”后，将自动生成打卡顺序和预计用时。</p>';
    return;
  }

  const planInfo = getRoutePlanInfo(activeRoute);

  if (!planInfo.steps.length) {
    refs.routePlan.innerHTML = '<p class="scenic-empty">当前路线暂无可用景点数据。</p>';
    return;
  }

  const summary = document.createElement("section");
  summary.className = "plan-summary";
  const routeRecommendedMode = getRouteRecommendedModeFromTotals(planInfo);
  const driveSourceLabel = getDriveSourceSummaryLabel(planInfo);
  summary.innerHTML = `
    <h4>${activeRoute.title} · 打卡计划</h4>
    <p>停留约 ${formatDuration(planInfo.totalVisitMinutes)}，推荐路途约 ${formatDuration(planInfo.totalTravelMinutes)}（${routeRecommendedMode.label}）。</p>
    <p>路线数据：${getPlanSourceLabel(planInfo)}</p>
    <div class="plan-summary-meta">
      <span class="meta-chip">建议出发 ${formatClock(planInfo.startMinute)}</span>
      <span class="meta-chip">预计完成 ${formatClock(planInfo.endMinute)}</span>
      <span class="meta-chip">总里程 ${planInfo.totalDistanceKm.toFixed(1)} km</span>
      <span class="meta-chip">总用时 ${formatDuration(planInfo.totalMinutes)}</span>
      <span class="meta-chip">步行 ${formatDuration(planInfo.totalWalkMinutes)}</span>
      <span class="meta-chip">骑行 ${formatDuration(planInfo.totalBikeMinutes)}</span>
      <span class="meta-chip">地铁 ${formatDuration(planInfo.totalMetroMinutes)}</span>
      <span class="meta-chip">驾车 ${formatDuration(planInfo.totalDriveMinutes)}（${driveSourceLabel}）</span>
    </div>
  `;

  const steps = document.createElement("div");
  steps.className = "plan-steps";
  steps.setAttribute("role", "list");

  planInfo.steps.forEach((step) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "plan-step";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", `${step.order}. ${step.spot.name}，按下后定位到地图`);

    const transferLine = step.nextTransfer
      ? `下一站：${step.nextTransfer.nextSpotName} · 约 ${step.nextTransfer.distanceKm.toFixed(1)} km`
      : "终点站：本路线打卡完成。";
    const modeRows = step.nextTransfer
      ? step.nextTransfer.modeOptions
          .map((modeOption) => {
            const recommendedClass = modeOption.key === step.nextTransfer.recommendedModeKey ? " recommended" : "";
            const sourceTag = modeOption.sourceLabel
              ? `<span class="plan-step-source">${modeOption.sourceLabel}</span>`
              : "";
            const trafficTag = modeOption.trafficLevel
              ? `<span class="plan-step-traffic">${modeOption.trafficLevel}</span>`
              : "";
            return `<li class="plan-step-mode${recommendedClass}"><span>${modeOption.key === step.nextTransfer.recommendedModeKey ? "推荐 " : ""}${modeOption.label}：${modeOption.minutes} 分钟</span>${sourceTag}${trafficTag}</li>`;
          })
          .join("")
      : "";

    item.innerHTML = `
      <h5>${step.order}. ${step.spot.name}</h5>
      <p>到达 ${formatClock(step.arrivalMinute)}，建议停留 ${step.visitMinutes} 分钟，预计离开 ${formatClock(step.leaveMinute)}。</p>
      <p class="plan-step-transfer">${transferLine}</p>
      ${step.nextTransfer ? `<ul class="plan-step-mode-list">${modeRows}</ul>` : ""}
    `;

    item.addEventListener("click", () => {
      focusSpot(step.spot.id, true);
    });

    steps.appendChild(item);
  });

  refs.routePlan.append(summary, steps);
}

function syncRouteCardState() {
  const cards = refs.routeCards.querySelectorAll(".route-card");

  cards.forEach((card) => {
    const isActive = card.dataset.id === state.activeRouteId;
    card.classList.toggle("active", isActive);

    const button = card.querySelector("button");
    button.textContent = isActive ? "取消高亮" : "查看路线";
    button.classList.toggle("ghost", isActive);
  });
}

function focusSpot(spotId, flyToSpot) {
  state.selectedSpotId = spotId;
  highlightSelectedCard();
  updateSpotSceneById(spotId);
  updateMapSpotInfo(scenicById.get(spotId) || null);
  syncUrlState();

  const marker = markerById.get(spotId);
  const spot = scenicById.get(spotId);
  if (!marker || !spot || !mapReady || !map) {
    return;
  }

  if (flyToSpot) {
    setMapView(getSpotMapLat(spot), getSpotMapLng(spot), 13, true);
  }

  marker.openPopup();
}

function highlightSelectedCard() {
  const cards = refs.scenicList.querySelectorAll(".scenic-item");

  cards.forEach((card) => {
    const isActive = card.dataset.id === state.selectedSpotId;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-pressed", isActive ? "true" : "false");

    if (isActive) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

function getRouteDistance(route) {
  return getRoutePlanInfo(route).totalDistanceKm;
}

function getRouteLegCacheKey(fromSpot, toSpot) {
  return `${fromSpot.id}->${toSpot.id}`;
}

function getFreshCachedRouteLegMetrics(cacheKey) {
  const cached = routeLegMetricsCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  const now = Date.now();
  if (!Number.isFinite(cached.modelExpiresAt) || cached.modelExpiresAt <= now) {
    routeLegMetricsCache.delete(cacheKey);
    schedulePersistRouteMetricsCache();
    return null;
  }

  if (Number.isFinite(cached.driveExpiresAt) && cached.driveExpiresAt > now) {
    return cached;
  }

  return {
    ...cached,
    driveMinutes: getDriveModelMinutes(cached.distanceMeters),
    driveTrafficLevel: "模型估算",
    driveSource: "model"
  };
}

function getFallbackDistanceMeters(fromSpot, toSpot) {
  return Math.max(120, Math.round(haversine(fromSpot, toSpot) * 1000 * 1.25));
}

function getStableModeMinutes(distanceMeters) {
  const safeDistanceKm = Math.max(0, Number(distanceMeters) || 0) / 1000;
  const walkMinutes = Math.max(
    4,
    Math.round((safeDistanceKm / travelModel.walkingSpeedKmh) * 60 + travelModel.walkingTransferBufferMinutes)
  );
  const bikeMinutes = Math.max(
    3,
    Math.round((safeDistanceKm / ROUTE_MODEL_BIKE_SPEED_KMH) * 60 + ROUTE_MODEL_BIKE_BUFFER_MINUTES)
  );
  const metroMinutes = Math.max(
    8,
    Math.round((safeDistanceKm / travelModel.metroSpeedKmh) * 60 + travelModel.metroTransferBufferMinutes)
  );

  return {
    walkMinutes,
    bikeMinutes,
    metroMinutes
  };
}

function getDriveModelMinutes(distanceMeters) {
  const safeDistanceKm = Math.max(0, Number(distanceMeters) || 0) / 1000;
  const baseMinutes =
    (safeDistanceKm / travelModel.taxiSpeedKmh) * 60 + travelModel.taxiTransferBufferMinutes;
  const congestedMinutes = baseMinutes * ROUTE_MODEL_DRIVE_CONGESTION_FACTOR + ROUTE_MODEL_DRIVE_BASE_MINUTES;
  return Math.max(8, Math.round(congestedMinutes));
}

function normalizeDriveTrafficLevel(level) {
  const value = typeof level === "string" ? level.trim() : "";
  if (!value) {
    return "未知";
  }
  if (["畅通", "缓行", "拥堵", "严重拥堵", "非常拥堵", "未知"].includes(value)) {
    return value;
  }
  return "未知";
}

function getDriveSourceLabel(source) {
  return source === "realtime" ? "实时路况" : "模型估算";
}

function buildRouteLegMetricsRecord(input) {
  const distanceMeters = Math.max(0, Math.round(Number(input?.distanceMeters) || 0));
  const stable = getStableModeMinutes(distanceMeters);
  const driveSource = input?.driveSource === "realtime" ? "realtime" : "model";
  const driveMinutesCandidate = Math.round(Number(input?.driveMinutes));
  const driveMinutes = Number.isFinite(driveMinutesCandidate) && driveMinutesCandidate > 0
    ? driveMinutesCandidate
    : getDriveModelMinutes(distanceMeters);
  const now = Date.now();
  const updatedAt = Number(input?.updatedAt);
  const normalizedUpdatedAt = Number.isFinite(updatedAt) && updatedAt > 0 ? updatedAt : now;
  const modelExpiresAtCandidate = Number(input?.modelExpiresAt);
  const modelExpiresAt = Number.isFinite(modelExpiresAtCandidate) && modelExpiresAtCandidate > normalizedUpdatedAt
    ? modelExpiresAtCandidate
    : normalizedUpdatedAt + ROUTE_CACHE_MODEL_TTL_MS;
  const driveExpiresAtCandidate = Number(input?.driveExpiresAt);
  const fallbackDriveTtl = driveSource === "realtime" ? ROUTE_CACHE_DRIVE_REALTIME_TTL_MS : ROUTE_CACHE_MODEL_TTL_MS;
  const driveExpiresAt = Number.isFinite(driveExpiresAtCandidate) && driveExpiresAtCandidate > normalizedUpdatedAt
    ? driveExpiresAtCandidate
    : normalizedUpdatedAt + fallbackDriveTtl;

  return {
    distanceMeters,
    walkMinutes: stable.walkMinutes,
    bikeMinutes: stable.bikeMinutes,
    metroMinutes: stable.metroMinutes,
    driveMinutes,
    driveTrafficLevel: driveSource === "realtime" ? normalizeDriveTrafficLevel(input?.driveTrafficLevel) : "模型估算",
    driveSource,
    updatedAt: normalizedUpdatedAt,
    modelExpiresAt,
    driveExpiresAt,
    expiresAt: Math.max(modelExpiresAt, driveExpiresAt)
  };
}

function normalizeStoredRouteLegMetrics(metrics) {
  if (!metrics || typeof metrics !== "object") {
    return null;
  }

  const distanceMeters = Number(metrics.distanceMeters);
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    return null;
  }

  return buildRouteLegMetricsRecord(metrics);
}

function setRouteLegMetricsCache(cacheKey, metrics) {
  if (!cacheKey) {
    return;
  }

  const now = Date.now();
  const normalized = buildRouteLegMetricsRecord({
    ...metrics,
    updatedAt: now,
    modelExpiresAt: now + ROUTE_CACHE_MODEL_TTL_MS,
    driveExpiresAt:
      now +
      (metrics?.driveSource === "realtime" ? ROUTE_CACHE_DRIVE_REALTIME_TTL_MS : ROUTE_CACHE_MODEL_TTL_MS)
  });

  routeLegMetricsCache.set(cacheKey, normalized);
  pruneRouteMetricsCache();
  schedulePersistRouteMetricsCache();
}

function pruneRouteMetricsCache() {
  let changed = false;
  const now = Date.now();

  Array.from(routeLegMetricsCache.entries()).forEach(([cacheKey, metrics]) => {
    if (
      !metrics ||
      !Number.isFinite(metrics.modelExpiresAt) ||
      !Number.isFinite(metrics.expiresAt) ||
      metrics.modelExpiresAt <= now ||
      metrics.expiresAt <= now
    ) {
      routeLegMetricsCache.delete(cacheKey);
      changed = true;
    }
  });

  if (routeLegMetricsCache.size <= ROUTE_CACHE_MAX_ENTRIES) {
    return changed;
  }

  const sortedByRecent = Array.from(routeLegMetricsCache.entries()).sort((a, b) => {
    const aTime = Number(a[1]?.updatedAt) || 0;
    const bTime = Number(b[1]?.updatedAt) || 0;
    return bTime - aTime;
  });
  const keepKeys = new Set(
    sortedByRecent.slice(0, ROUTE_CACHE_MAX_ENTRIES).map(([cacheKey]) => cacheKey)
  );

  Array.from(routeLegMetricsCache.keys()).forEach((cacheKey) => {
    if (!keepKeys.has(cacheKey)) {
      routeLegMetricsCache.delete(cacheKey);
      changed = true;
    }
  });

  return changed;
}

function schedulePersistRouteMetricsCache() {
  if (routeCachePersistTimer) {
    clearTimeout(routeCachePersistTimer);
  }

  routeCachePersistTimer = window.setTimeout(() => {
    routeCachePersistTimer = null;
    persistRouteMetricsCacheToStorage();
  }, ROUTE_CACHE_PERSIST_DEBOUNCE_MS);
}

function persistRouteMetricsCacheToStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  pruneRouteMetricsCache();
  const payload = {};
  routeLegMetricsCache.forEach((metrics, cacheKey) => {
    payload[cacheKey] = metrics;
  });

  try {
    if (Object.keys(payload).length) {
      window.localStorage.setItem(ROUTE_CACHE_STORAGE_KEY, JSON.stringify(payload));
    } else {
      window.localStorage.removeItem(ROUTE_CACHE_STORAGE_KEY);
    }
  } catch (error) {
    // localStorage 可能不可用（如隐私模式），这里静默降级到内存缓存
  }
}

function loadRouteMetricsCacheFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  let raw = "";
  try {
    raw = window.localStorage.getItem(ROUTE_CACHE_STORAGE_KEY) || "";
  } catch (error) {
    return;
  }

  if (!raw) {
    return;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    try {
      window.localStorage.removeItem(ROUTE_CACHE_STORAGE_KEY);
    } catch (ignored) {}
    return;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return;
  }

  let changed = false;
  Object.entries(parsed).forEach(([cacheKey, metrics]) => {
    const normalized = normalizeStoredRouteLegMetrics(metrics);
    if (!normalized) {
      changed = true;
      return;
    }

    routeLegMetricsCache.set(cacheKey, normalized);
  });

  if (pruneRouteMetricsCache()) {
    changed = true;
  }

  if (changed) {
    persistRouteMetricsCacheToStorage();
  }
}

function getRouteLegMetrics(fromSpot, toSpot) {
  const cacheKey = getRouteLegCacheKey(fromSpot, toSpot);
  const cached = getFreshCachedRouteLegMetrics(cacheKey);
  if (cached) {
    return cached;
  }

  return buildRouteLegMetricsRecord({
    distanceMeters: getFallbackDistanceMeters(fromSpot, toSpot),
    driveSource: "model"
  });
}

function getRouteRecommendedModeFromTotals(planInfo) {
  const candidates = [
    { key: "walk", label: "步行", minutes: planInfo.totalWalkMinutes },
    { key: "bike", label: "骑行", minutes: planInfo.totalBikeMinutes },
    { key: "metro", label: "地铁", minutes: planInfo.totalMetroMinutes },
    { key: "drive", label: "驾车", minutes: planInfo.totalDriveMinutes }
  ].filter((item) => Number.isFinite(item.minutes) && item.minutes >= 0);

  if (!candidates.length) {
    return { key: "metro", label: "地铁", minutes: 0 };
  }

  return candidates.reduce((best, current) => (current.minutes < best.minutes ? current : best));
}

function getDriveSourceSummaryLabel(planInfo) {
  if (!planInfo.totalLegCount) {
    return "模型估算";
  }
  if (planInfo.driveRealtimeLegCount === planInfo.totalLegCount) {
    return "实时路况";
  }
  if (planInfo.driveRealtimeLegCount === 0) {
    return "模型估算";
  }
  return "混合";
}

function getPlanSourceLabel(planInfo) {
  if (!planInfo.totalLegCount) {
    return "无路段数据";
  }

  if (planInfo.driveRealtimeLegCount === planInfo.totalLegCount) {
    return "实时路况 + 模型估算";
  }

  if (planInfo.driveRealtimeLegCount === 0) {
    return "模型估算";
  }

  return `混合（实时路况 ${planInfo.driveRealtimeLegCount}/${planInfo.totalLegCount}）`;
}

function renderRouteDataHint() {
  if (!refs.routeDataHint) {
    return;
  }

  refs.routeDataHint.classList.remove("loading", "partial");

  const activeRoute = getActiveRoute();
  if (!activeRoute) {
    refs.routeDataHint.textContent = "路线时间默认按模型估算，驾车可在配置 Key 后启用实时路况。";
    return;
  }

  const planInfo = getRoutePlanInfo(activeRoute);
  if (routeMetricsLoading) {
    refs.routeDataHint.textContent = "正在获取驾车实时路况（步行/骑行/地铁保持模型估算）...";
    refs.routeDataHint.classList.add("loading");
    return;
  }

  if (!AMAP_WEB_SERVICE_KEY) {
    refs.routeDataHint.textContent = "未配置高德 Key，驾车时长已回退为模型估算。";
    refs.routeDataHint.classList.add("partial");
    return;
  }

  if (planInfo.driveRealtimeLegCount === planInfo.totalLegCount && planInfo.totalLegCount > 0) {
    refs.routeDataHint.textContent = "当前路线驾车时长已全部命中实时路况。";
    return;
  }

  if (routeMetricsStatusNote) {
    refs.routeDataHint.textContent = routeMetricsStatusNote;
    refs.routeDataHint.classList.add("partial");
    return;
  }

  refs.routeDataHint.textContent = `当前路线驾车实时路况命中 ${planInfo.driveRealtimeLegCount}/${planInfo.totalLegCount} 段。`;
  if (planInfo.driveRealtimeLegCount < planInfo.totalLegCount) {
    refs.routeDataHint.classList.add("partial");
  }
}

function shouldFetchRouteLegMetrics(cacheKey) {
  const cachedRaw = routeLegMetricsCache.get(cacheKey);
  if (!cachedRaw) {
    return true;
  }

  const now = Date.now();
  if (!Number.isFinite(cachedRaw.modelExpiresAt) || cachedRaw.modelExpiresAt <= now) {
    return true;
  }

  if (!AMAP_WEB_SERVICE_KEY) {
    return false;
  }

  return (
    cachedRaw.driveSource !== "realtime" ||
    !Number.isFinite(cachedRaw.driveExpiresAt) ||
    cachedRaw.driveExpiresAt <= now
  );
}

function prefetchActiveRouteMetrics() {
  const activeRoute = getActiveRoute();
  if (!activeRoute) {
    if (lastRouteMetricsRouteId !== null) {
      routeMetricsRequestSeq += 1;
      lastRouteMetricsRouteId = null;
    }
    routeMetricsLoading = false;
    routeMetricsStatusNote = "";
    return;
  }

  if (lastRouteMetricsRouteId !== activeRoute.id) {
    routeMetricsRequestSeq += 1;
    routeMetricsStatusNote = "";
    lastRouteMetricsRouteId = activeRoute.id;
  }

  const routeSpots = activeRoute.spotIds.map((id) => scenicById.get(id)).filter(Boolean);
  if (routeSpots.length < 2) {
    return;
  }

  const missingPairs = [];
  for (let i = 0; i < routeSpots.length - 1; i += 1) {
    const fromSpot = routeSpots[i];
    const toSpot = routeSpots[i + 1];
    const cacheKey = getRouteLegCacheKey(fromSpot, toSpot);
    if (shouldFetchRouteLegMetrics(cacheKey) && !routeLegMetricsInFlight.has(cacheKey)) {
      missingPairs.push({ fromSpot, toSpot, cacheKey });
    }
  }

  if (!missingPairs.length) {
    routeMetricsLoading = false;
    return;
  }

  routeMetricsLoading = true;
  const currentRequestSeq = ++routeMetricsRequestSeq;
  renderRouteDataHint();

  const fetchTasks = missingPairs.map(async ({ fromSpot, toSpot, cacheKey }) => {
    routeLegMetricsInFlight.add(cacheKey);
    try {
      const metrics = await fetchRouteLegMetrics(fromSpot, toSpot);
      setRouteLegMetricsCache(cacheKey, metrics);
    } catch (error) {
      setRouteLegMetricsCache(cacheKey, {
        distanceMeters: getFallbackDistanceMeters(fromSpot, toSpot),
        driveSource: "model"
      });
      routeMetricsStatusNote = "部分路段实时路况获取失败，已自动回退为模型估算。";
    } finally {
      routeLegMetricsInFlight.delete(cacheKey);
    }
  });

  Promise.allSettled(fetchTasks).then(() => {
    if (currentRequestSeq !== routeMetricsRequestSeq) {
      return;
    }

    routeMetricsLoading = false;
    refreshRouteSections();
  });
}

function extractAmapTrafficLevel(path) {
  const severity = {
    畅通: 1,
    缓行: 2,
    拥堵: 3,
    严重拥堵: 4,
    非常拥堵: 4
  };
  let topLevel = "未知";
  let topScore = 0;

  const steps = Array.isArray(path?.steps) ? path.steps : [];
  steps.forEach((step) => {
    const tmcs = Array.isArray(step?.tmcs) ? step.tmcs : [];
    tmcs.forEach((segment) => {
      const status = normalizeDriveTrafficLevel(segment?.status);
      const score = severity[status] || 0;
      if (score > topScore) {
        topScore = score;
        topLevel = status;
      }
    });
  });

  return topLevel;
}

async function fetchAmapDrivingMetrics(fromSpot, toSpot) {
  if (!AMAP_WEB_SERVICE_KEY) {
    throw new Error("AMap key unavailable");
  }

  const origin = `${getSpotMapLng(fromSpot)},${getSpotMapLat(fromSpot)}`;
  const destination = `${getSpotMapLng(toSpot)},${getSpotMapLat(toSpot)}`;
  const params = new URLSearchParams({
    key: AMAP_WEB_SERVICE_KEY,
    origin,
    destination,
    extensions: "all",
    strategy: "0",
    output: "json"
  });
  const url = `${AMAP_DRIVING_API_URL}?${params.toString()}`;
  const data = await fetchJsonWithTimeout(url, ROUTE_FETCH_TIMEOUT_MS);
  if (!data || data.status !== "1" || !data.route || !Array.isArray(data.route.paths) || !data.route.paths.length) {
    throw new Error("AMap driving payload invalid.");
  }

  const firstPath = data.route.paths[0];
  const distanceMeters = Math.max(0, Math.round(Number(firstPath.distance) || 0));
  const driveMinutes = Math.max(1, Math.round((Number(firstPath.duration) || 0) / 60));
  if (!distanceMeters || !driveMinutes) {
    throw new Error("AMap driving distance or duration invalid.");
  }

  return {
    distanceMeters,
    driveMinutes,
    driveTrafficLevel: extractAmapTrafficLevel(firstPath)
  };
}

async function fetchNetworkDistanceMeters(fromSpot, toSpot) {
  const fromLng = getSpotMapLng(fromSpot);
  const fromLat = getSpotMapLat(fromSpot);
  const toLng = getSpotMapLng(toSpot);
  const toLat = getSpotMapLat(toSpot);
  const routeUrl = `${REAL_ROUTE_ENGINE_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&alternatives=false&steps=false&continue_straight=true`;
  const data = await fetchJsonWithTimeout(routeUrl, ROUTE_FETCH_TIMEOUT_MS);
  if (!data || data.code !== "Ok" || !Array.isArray(data.routes) || !data.routes.length) {
    throw new Error("Route engine returned invalid payload.");
  }

  const firstRoute = data.routes[0];
  return Math.max(0, Math.round(Number(firstRoute.distance) || 0));
}

async function fetchRouteLegMetrics(fromSpot, toSpot) {
  let distanceMeters = 0;
  let driveMinutes = 0;
  let driveTrafficLevel = "模型估算";
  let driveSource = "model";

  if (AMAP_WEB_SERVICE_KEY) {
    try {
      const realTimeMetrics = await fetchAmapDrivingMetrics(fromSpot, toSpot);
      distanceMeters = realTimeMetrics.distanceMeters;
      driveMinutes = realTimeMetrics.driveMinutes;
      driveTrafficLevel = realTimeMetrics.driveTrafficLevel;
      driveSource = "realtime";
    } catch (error) {
      routeMetricsStatusNote = "部分路段未命中实时路况，已混合模型估算。";
    }
  }

  if (!distanceMeters) {
    try {
      distanceMeters = await fetchNetworkDistanceMeters(fromSpot, toSpot);
    } catch (error) {
      distanceMeters = getFallbackDistanceMeters(fromSpot, toSpot);
    }
  }

  if (!driveMinutes || driveSource !== "realtime") {
    driveMinutes = getDriveModelMinutes(distanceMeters);
    driveTrafficLevel = "模型估算";
    driveSource = "model";
  }

  return buildRouteLegMetricsRecord({
    distanceMeters,
    driveMinutes,
    driveTrafficLevel,
    driveSource
  });
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: abortController.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function chooseRecommendedModeForLeg(legMetrics) {
  const candidates = [
    { key: "walk", label: "步行", minutes: legMetrics.walkMinutes },
    { key: "bike", label: "骑行", minutes: legMetrics.bikeMinutes },
    { key: "metro", label: "地铁", minutes: legMetrics.metroMinutes },
    { key: "drive", label: "驾车", minutes: legMetrics.driveMinutes }
  ];

  return candidates.reduce((best, current) => (current.minutes < best.minutes ? current : best));
}

function buildLegModeOptions(legMetrics, recommendedModeKey) {
  return [
    {
      key: "walk",
      label: "步行",
      minutes: legMetrics.walkMinutes,
      sourceLabel: "模型估算"
    },
    {
      key: "bike",
      label: "骑行",
      minutes: legMetrics.bikeMinutes,
      sourceLabel: "模型估算"
    },
    {
      key: "metro",
      label: "地铁",
      minutes: legMetrics.metroMinutes,
      sourceLabel: "模型估算"
    },
    {
      key: "drive",
      label: "驾车",
      minutes: legMetrics.driveMinutes,
      sourceLabel: getDriveSourceLabel(legMetrics.driveSource),
      trafficLevel:
        legMetrics.driveSource === "realtime" ? normalizeDriveTrafficLevel(legMetrics.driveTrafficLevel) : ""
    }
  ].map((mode) => ({
    ...mode,
    recommended: mode.key === recommendedModeKey
  }));
}

function getRoutePlanInfo(route) {
  const routeSpots = route.spotIds.map((id) => scenicById.get(id)).filter(Boolean);
  const steps = [];

  if (!routeSpots.length) {
    return {
      steps,
      totalDistanceKm: 0,
      totalVisitMinutes: 0,
      totalTravelMinutes: 0,
      totalWalkMinutes: 0,
      totalBikeMinutes: 0,
      totalMetroMinutes: 0,
      totalDriveMinutes: 0,
      totalMinutes: 0,
      totalLegCount: 0,
      driveRealtimeLegCount: 0,
      driveModelLegCount: 0,
      startMinute: ROUTE_START_MINUTE,
      endMinute: ROUTE_START_MINUTE
    };
  }

  let totalDistanceMeters = 0;
  let totalVisitMinutes = 0;
  let totalTravelMinutes = 0;
  let totalWalkMinutes = 0;
  let totalBikeMinutes = 0;
  let totalMetroMinutes = 0;
  let totalDriveMinutes = 0;
  let driveRealtimeLegCount = 0;
  let driveModelLegCount = 0;
  let currentMinute = ROUTE_START_MINUTE;

  for (let i = 0; i < routeSpots.length; i += 1) {
    const spot = routeSpots[i];
    const visitMinutes = getVisitMinutes(spot.type);
    const arrivalMinute = currentMinute;
    const leaveMinute = arrivalMinute + visitMinutes;
    totalVisitMinutes += visitMinutes;

    let nextTransfer = null;
    if (i < routeSpots.length - 1) {
      const nextSpot = routeSpots[i + 1];
      const legMetrics = getRouteLegMetrics(spot, nextSpot);
      const recommendedMode = chooseRecommendedModeForLeg(legMetrics);
      const modeOptions = buildLegModeOptions(legMetrics, recommendedMode.key);

      totalDistanceMeters += legMetrics.distanceMeters;
      totalTravelMinutes += recommendedMode.minutes;
      totalWalkMinutes += legMetrics.walkMinutes;
      totalBikeMinutes += legMetrics.bikeMinutes;
      totalMetroMinutes += legMetrics.metroMinutes;
      totalDriveMinutes += legMetrics.driveMinutes;
      currentMinute = leaveMinute + recommendedMode.minutes;

      if (legMetrics.driveSource === "realtime") {
        driveRealtimeLegCount += 1;
      } else {
        driveModelLegCount += 1;
      }

      nextTransfer = {
        nextSpotName: nextSpot.name,
        distanceKm: legMetrics.distanceMeters / 1000,
        recommendedModeKey: recommendedMode.key,
        recommendedModeLabel: recommendedMode.label,
        recommendedMinutes: recommendedMode.minutes,
        modeOptions
      };
    } else {
      currentMinute = leaveMinute;
    }

    steps.push({
      order: i + 1,
      spot,
      arrivalMinute,
      leaveMinute,
      visitMinutes,
      nextTransfer
    });
  }

  const totalMinutes = totalVisitMinutes + totalTravelMinutes;
  return {
    steps,
    totalDistanceKm: totalDistanceMeters / 1000,
    totalVisitMinutes,
    totalTravelMinutes,
    totalWalkMinutes,
    totalBikeMinutes,
    totalMetroMinutes,
    totalDriveMinutes,
    totalMinutes,
    totalLegCount: Math.max(routeSpots.length - 1, 0),
    driveRealtimeLegCount,
    driveModelLegCount,
    startMinute: ROUTE_START_MINUTE,
    endMinute: ROUTE_START_MINUTE + totalMinutes
  };
}

function getVisitMinutes(type) {
  return STOP_TIME_BY_TYPE[type] || 60;
}

function formatDuration(totalMinutes) {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (!hours) {
    return `${minutes} 分钟`;
  }

  if (!remainder) {
    return `${hours} 小时`;
  }

  return `${hours} 小时 ${remainder} 分钟`;
}

function formatClock(minutesOfDay) {
  const normalized = ((Math.round(minutesOfDay) % 1440) + 1440) % 1440;
  const hour = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minute = String(normalized % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function getSpotPopupHtml(spot) {
  const lat = Number.parseFloat(getSpotMapLat(spot)).toFixed(6);
  const lng = Number.parseFloat(getSpotMapLng(spot)).toFixed(6);
  return `
    <div class="popup-body">
      <h4>${spot.name}</h4>
      <p class="popup-meta">${spot.type} · ${spot.district}</p>
      <p class="popup-address">地址：${spot.address}</p>
      <p class="popup-address">坐标：${lat}, ${lng}</p>
      <p class="popup-brief">${spot.brief}</p>
      <p class="popup-intro">${spot.intro}</p>
    </div>
  `;
}

async function loadShanghaiBoundaryFeature() {
  const payload = await fetchJsonWithTimeout(SHANGHAI_BOUNDARY_GEOJSON_URL, ROUTE_FETCH_TIMEOUT_MS);
  if (!payload || payload.type !== "FeatureCollection" || !Array.isArray(payload.features)) {
    throw new Error("Boundary payload invalid.");
  }

  const feature = payload.features.find((item) => item?.geometry?.type === "Polygon" || item?.geometry?.type === "MultiPolygon");
  if (!feature) {
    throw new Error("Boundary feature missing.");
  }

  return feature;
}

function getBoundaryOuterRingsLatLngs(feature) {
  const geometry = feature?.geometry;
  if (!geometry) {
    return [];
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    const outerRing = geometry.coordinates[0];
    if (Array.isArray(outerRing)) {
      return [
        outerRing
          .map((point) => [Number(point?.[1]), Number(point?.[0])])
          .filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]))
      ];
    }
  }

  if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates
      .map((polygon) => polygon?.[0] || [])
      .map((ring) =>
        ring
          .map((point) => [Number(point?.[1]), Number(point?.[0])])
          .filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]))
      )
      .filter((ring) => ring.length >= 3);
  }

  return [];
}

function removeShanghaiMaskLayers() {
  if (!map) {
    return;
  }

  if (shanghaiBoundaryMaskLayer) {
    map.removeLayer(shanghaiBoundaryMaskLayer);
    shanghaiBoundaryMaskLayer = null;
  }

  if (shanghaiBoundaryOutlineLayer) {
    map.removeLayer(shanghaiBoundaryOutlineLayer);
    shanghaiBoundaryOutlineLayer = null;
  }
}

function applyShanghaiBoundsFromRings(rings) {
  if (!map || !rings.length || typeof window.L === "undefined") {
    return;
  }

  const boundaryBounds = window.L.latLngBounds(rings[0]);
  rings.slice(1).forEach((ring) => {
    ring.forEach((point) => {
      boundaryBounds.extend(point);
    });
  });
  shanghaiBoundaryBounds = boundaryBounds;
  map.setMaxBounds(shanghaiBoundaryBounds);
  map.options.maxBoundsViscosity = 1;

  const dynamicMinZoom = map.getBoundsZoom(shanghaiBoundaryBounds, false, [20, 20]);
  shanghaiMinZoom = Math.max(8, Math.min(11, dynamicMinZoom));
  map.setMinZoom(shanghaiMinZoom);

  removeShanghaiMaskLayers();
  shanghaiBoundaryOutlineLayer = window.L.geoJSON(
    {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: rings.map((ring) => [ring.map((point) => [point[1], point[0]])])
      }
    },
    {
      style: {
        color: "#b61f15",
        weight: 1.4,
        opacity: 0.7,
        fillOpacity: 0
      },
      interactive: false
    }
  ).addTo(map);

  const worldOuterRing = [
    [-90, -360],
    [-90, 360],
    [90, 360],
    [90, -360]
  ];
  shanghaiBoundaryMaskLayer = window.L.polygon([worldOuterRing, ...rings], {
    stroke: false,
    fillColor: "#2b1d19",
    fillOpacity: 0.22,
    fillRule: "evenodd",
    interactive: false,
    className: "map-shanghai-mask"
  }).addTo(map);
}

async function applyShanghaiBoundaryRestriction() {
  if (!map || typeof window.L === "undefined") {
    return;
  }

  try {
    const feature = await loadShanghaiBoundaryFeature();
    const rings = getBoundaryOuterRingsLatLngs(feature);
    if (!rings.length) {
      throw new Error("Boundary ring missing.");
    }
    applyShanghaiBoundsFromRings(rings);
  } catch (error) {
    const fallbackBounds = window.L.latLngBounds(SHANGHAI_FALLBACK_BOUNDS);
    shanghaiBoundaryBounds = fallbackBounds;
    map.setMaxBounds(fallbackBounds);
    map.options.maxBoundsViscosity = 1;
    shanghaiMinZoom = Math.max(8, Math.min(11, map.getBoundsZoom(fallbackBounds, false, [20, 20])));
    map.setMinZoom(shanghaiMinZoom);
    removeShanghaiMaskLayers();
    const [southWest, northEast] = SHANGHAI_FALLBACK_BOUNDS;
    const fallbackRing = [
      [southWest[0], southWest[1]],
      [southWest[0], northEast[1]],
      [northEast[0], northEast[1]],
      [northEast[0], southWest[1]]
    ];
    shanghaiBoundaryMaskLayer = window.L.polygon(
      [
        [
          [-90, -360],
          [-90, 360],
          [90, 360],
          [90, -360]
        ],
        fallbackRing
      ],
      {
        stroke: false,
        fillColor: "#2b1d19",
        fillOpacity: 0.22,
        fillRule: "evenodd",
        interactive: false,
        className: "map-shanghai-mask"
      }
    ).addTo(map);
  }
}

function clampLatLngToShanghaiBounds(lat, lng) {
  if (!shanghaiBoundaryBounds) {
    return {
      lat,
      lng
    };
  }

  const southWest = shanghaiBoundaryBounds.getSouthWest();
  const northEast = shanghaiBoundaryBounds.getNorthEast();
  return {
    lat: Math.min(northEast.lat, Math.max(southWest.lat, lat)),
    lng: Math.min(northEast.lng, Math.max(southWest.lng, lng))
  };
}

function fitMapToShanghaiBounds(animated) {
  if (!mapReady || !map || !shanghaiBoundaryBounds) {
    setMapView(SHANGHAI_CENTER[0], SHANGHAI_CENTER[1], SHANGHAI_ZOOM, Boolean(animated));
    return;
  }

  if (animated) {
    map.flyToBounds(shanghaiBoundaryBounds, {
      animate: true,
      duration: 0.9,
      padding: [18, 18],
      maxZoom: clampMapZoom(SHANGHAI_ZOOM)
    });
    return;
  }

  map.fitBounds(shanghaiBoundaryBounds, {
    animate: false,
    padding: [18, 18],
    maxZoom: clampMapZoom(SHANGHAI_ZOOM)
  });
}

function initMap() {
  if (typeof window.L === "undefined") {
    showMapUnavailable("地图引擎加载失败，请检查网络后刷新。");
    return;
  }

  const startView = pendingMapView || {
    lat: SHANGHAI_CENTER[0],
    lng: SHANGHAI_CENTER[1],
    zoom: SHANGHAI_ZOOM
  };

  try {
    map = window.L.map("map", {
      zoomControl: true,
      minZoom: shanghaiMinZoom,
      maxZoom: 19,
      preferCanvas: true,
      maxBounds: window.L.latLngBounds(SHANGHAI_FALLBACK_BOUNDS),
      maxBoundsViscosity: 1,
      inertia: false,
      worldCopyJump: false
    });

    const highResStreetLayer = window.L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
        detectRetina: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    );

    const standardStreetLayer = window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        detectRetina: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    );

    highResStreetLayer.addTo(map);
    window.L.control
      .layers(
        {
          "高清街道图（推荐）": highResStreetLayer,
          标准街道图: standardStreetLayer
        },
        null,
        {
          collapsed: true,
          position: "topright"
        }
      )
      .addTo(map);

    map.setView([startView.lat, startView.lng], clampMapZoom(startView.zoom), { animate: false });

    applyShanghaiBoundaryRestriction()
      .then(() => {
        mapReady = true;
        clearMapUnavailable();
        bindMapMoveEnd();
        if (pendingMapView) {
          setMapView(pendingMapView.lat, pendingMapView.lng, pendingMapView.zoom, false);
        } else {
          fitMapToShanghaiBounds(false);
        }
        updateView();
      })
      .catch(() => {
        mapReady = true;
        clearMapUnavailable();
        bindMapMoveEnd();
        fitMapToShanghaiBounds(false);
        updateView();
      });
  } catch (error) {
    showMapUnavailable("地图初始化失败，请刷新后重试。");
  }
}

function clampMapZoom(zoom) {
  if (!Number.isFinite(zoom)) {
    return SHANGHAI_ZOOM;
  }

  return Math.max(shanghaiMinZoom, Math.min(17, Math.round(zoom)));
}

function bindMapMoveEnd() {
  if (!mapReady || !map || mapMoveEndBound) {
    return;
  }

  map.on("moveend", () => {
    if (shanghaiBoundaryBounds) {
      const center = map.getCenter();
      if (!shanghaiBoundaryBounds.contains(center)) {
        const clamped = clampLatLngToShanghaiBounds(center.lat, center.lng);
        map.panTo(clamped, { animate: false });
      }
    }
    syncUrlState();
  });

  mapMoveEndBound = true;
}

function setMapView(lat, lng, zoom, animated) {
  const clamped = clampLatLngToShanghaiBounds(lat, lng);
  pendingMapView = {
    lat: clamped.lat,
    lng: clamped.lng,
    zoom: clampMapZoom(zoom)
  };

  if (!mapReady || !map) {
    return;
  }

  const latLng = [pendingMapView.lat, pendingMapView.lng];
  if (animated) {
    map.flyTo(latLng, pendingMapView.zoom, {
      duration: 0.9,
      easeLinearity: 0.22
    });
    return;
  }

  map.setView(latLng, pendingMapView.zoom, {
    animate: false
  });
}

function getMapCenter() {
  if (mapReady && map) {
    const center = map.getCenter();
    const clampedCenter = clampLatLngToShanghaiBounds(center.lat, center.lng);
    return {
      lat: clampedCenter.lat,
      lng: clampedCenter.lng
    };
  }

  if (pendingMapView) {
    return {
      lat: pendingMapView.lat,
      lng: pendingMapView.lng
    };
  }

  return {
    lat: SHANGHAI_CENTER[0],
    lng: SHANGHAI_CENTER[1]
  };
}

function getMapZoom() {
  if (mapReady && map) {
    return map.getZoom();
  }

  if (pendingMapView) {
    return pendingMapView.zoom;
  }

  return SHANGHAI_ZOOM;
}

function fitMapToSpots(spots) {
  if (!mapReady || !map || !spots.length || typeof window.L === "undefined") {
    return;
  }

  if (spots.length === 1) {
    setMapView(getSpotMapLat(spots[0]), getSpotMapLng(spots[0]), 13, true);
    return;
  }

  const bounds = window.L.latLngBounds(
    spots.map((spot) => [getSpotMapLat(spot), getSpotMapLng(spot)])
  );
  map.fitBounds(bounds, {
    padding: [36, 36],
    maxZoom: 14,
    animate: true
  });
}

function showMapUnavailable(message) {
  mapReady = false;
  const mapEl = document.getElementById("map");
  if (mapEl) {
    mapEl.innerHTML = `<div class="map-unavailable">${message}</div>`;
  }
}

function clearMapUnavailable() {
  const mapEl = document.getElementById("map");
  const unavailable = mapEl?.querySelector(".map-unavailable");
  if (unavailable) {
    unavailable.remove();
  }
}

function updateMapSpotInfo(spot) {
  if (!refs.mapSpotInfo) {
    return;
  }

  if (!spot) {
    refs.mapSpotInfo.innerHTML = "点击地图标点可查看该地点的地址和介绍。";
    return;
  }

  const parkingInfo = spot.parking
    ? `<p><strong>\u{1f17f}\ufe0f 停车场：</strong>${spot.parking.name}（${spot.parking.distance}）${spot.parking.note ? " — " + spot.parking.note : ""}</p>`
    : "";

  refs.mapSpotInfo.innerHTML = `
    <h4>${spot.name}</h4>
    <p><strong>地址：</strong>${spot.address}</p>
    <p><strong>坐标：</strong>${getSpotMapLat(spot).toFixed(6)}, ${getSpotMapLng(spot).toFixed(6)}</p>
    ${parkingInfo}
    <p>${spot.intro}</p>
  `;
}

function normalizePanoramaRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const spotId = typeof record.spotId === "string" ? record.spotId.trim() : "";
  const provider = record.provider === "local" ? "local" : record.provider === "baidu" ? "baidu" : "";
  const panoIdOrUrl = typeof record.panoIdOrUrl === "string" ? record.panoIdOrUrl.trim() : "";
  if (!spotId || !provider || !panoIdOrUrl || !scenicById.has(spotId)) {
    return null;
  }

  return {
    spotId,
    provider,
    panoIdOrUrl,
    heading: Number.isFinite(Number(record.heading)) ? Number(record.heading) : 0,
    pitch: Number.isFinite(Number(record.pitch)) ? Number(record.pitch) : 0,
    fov: Number.isFinite(Number(record.fov)) ? Number(record.fov) : 95,
    copyright: typeof record.copyright === "string" ? record.copyright.trim() : ""
  };
}

async function loadPanoramaIndex() {
  if (panoramaIndexLoaded) {
    return panoramaBySpotId;
  }
  if (panoramaIndexLoadingPromise) {
    return panoramaIndexLoadingPromise;
  }

  panoramaIndexLoadingPromise = fetchJsonWithTimeout(PANORAMA_INDEX_URL, ROUTE_FETCH_TIMEOUT_MS)
    .then((payload) => {
      const records = Array.isArray(payload) ? payload : [];
      const grouped = new Map();
      records.forEach((record) => {
        const normalized = normalizePanoramaRecord(record);
        if (!normalized) {
          return;
        }
        if (!grouped.has(normalized.spotId)) {
          grouped.set(normalized.spotId, []);
        }
        grouped.get(normalized.spotId).push(normalized);
      });

      grouped.forEach((items) => {
        items.sort((a, b) => {
          if (a.provider === b.provider) {
            return 0;
          }
          return a.provider === "baidu" ? -1 : 1;
        });
      });

      panoramaBySpotId.clear();
      grouped.forEach((items, spotId) => {
        panoramaBySpotId.set(spotId, items);
      });
      panoramaIndexLoaded = true;
      panoramaIndexLoadingPromise = null;
      return panoramaBySpotId;
    })
    .catch(() => {
      panoramaIndexLoaded = true;
      panoramaIndexLoadingPromise = null;
      panoramaBySpotId.clear();
      return panoramaBySpotId;
    });

  return panoramaIndexLoadingPromise;
}

function buildBaiduPanoramaUrl(record, spot) {
  if (!BAIDU_AK) {
    return {
      ok: false,
      reasonCode: "权限",
      reasonMessage: "未配置百度街景 Key，无法加载全景。"
    };
  }

  if (/^https?:\/\//i.test(record.panoIdOrUrl)) {
    return {
      ok: true,
      url: record.panoIdOrUrl
    };
  }

  const params = new URLSearchParams({
    ak: BAIDU_AK,
    width: "1280",
    height: "720",
    heading: String(record.heading),
    pitch: String(record.pitch),
    fov: String(record.fov)
  });
  if (record.panoIdOrUrl.includes(",")) {
    params.set("location", record.panoIdOrUrl);
  } else {
    params.set("id", record.panoIdOrUrl);
    params.set("location", `${getSpotMapLng(spot)},${getSpotMapLat(spot)}`);
  }
  return {
    ok: true,
    url: `${BAIDU_PANORAMA_IMAGE_URL}?${params.toString()}`
  };
}

function buildPanoramaAsset(record, spot) {
  if (record.provider === "baidu") {
    return buildBaiduPanoramaUrl(record, spot);
  }

  if (/^https?:\/\//i.test(record.panoIdOrUrl) || record.panoIdOrUrl.startsWith("./")) {
    return {
      ok: true,
      url: record.panoIdOrUrl
    };
  }

  return {
    ok: false,
    reasonCode: "无覆盖",
    reasonMessage: "本地全景素材路径无效。"
  };
}

async function loadImageWithTimeout(src, timeoutMs) {
  return await Promise.race([
    loadImage(src),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"));
      }, timeoutMs);
    })
  ]);
}

async function tryRenderPanoramaForSpot(spot, requestId) {
  await loadPanoramaIndex();
  const entries = panoramaBySpotId.get(spot.id) || [];
  if (!entries.length) {
    return {
      ok: false,
      reasonCode: "无覆盖",
      reasonMessage: "暂无可用全景。"
    };
  }

  let lastFailure = {
    reasonCode: "无覆盖",
    reasonMessage: "暂无可用全景。"
  };
  for (const entry of entries) {
    const candidate = buildPanoramaAsset(entry, spot);
    if (!candidate.ok) {
      lastFailure = {
        reasonCode: candidate.reasonCode || "无覆盖",
        reasonMessage: candidate.reasonMessage || "全景资源不可用。"
      };
      continue;
    }

    try {
      await loadImageWithTimeout(candidate.url, 4200);
      if (requestId !== sceneRenderRequestSeq) {
        return {
          ok: false,
          reasonCode: "过期",
          reasonMessage: "场景已切换。"
        };
      }

      if (refs.scenePanoramaImage) {
        refs.scenePanoramaImage.src = candidate.url;
        refs.scenePanoramaImage.alt = `${spot.name} 全景图`;
      }
      if (refs.scenePanoramaMeta) {
        refs.scenePanoramaMeta.textContent = `${entry.provider === "baidu" ? "百度街景" : "本地全景"} · ${entry.copyright || "景点全景"}`;
      }
      return {
        ok: true,
        source: entry.provider
      };
    } catch (error) {
      lastFailure = {
        reasonCode: error?.message === "timeout" ? "超时" : "无覆盖",
        reasonMessage: error?.message === "timeout" ? "全景加载超时。" : "全景资源加载失败。"
      };
    }
  }

  if (refs.scenePanoramaImage) {
    refs.scenePanoramaImage.removeAttribute("src");
    refs.scenePanoramaImage.alt = `${spot.name} 暂无全景`;
  }
  if (refs.scenePanoramaMeta) {
    refs.scenePanoramaMeta.textContent = "暂无可用全景";
  }
  return {
    ok: false,
    reasonCode: lastFailure.reasonCode,
    reasonMessage: lastFailure.reasonMessage
  };
}

function initScene3D() {
  if (typeof window.require !== "function") {
    refs.scene3dHint.textContent = "3D 引擎加载失败，请刷新页面重试。";
    return;
  }

  window.require(
    [
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/GraphicsLayer",
      "esri/Graphic",
      "esri/layers/SceneLayer"
    ],
    (ArcGISMap, SceneView, GraphicsLayer, Graphic, SceneLayer) => {
      const map3d = new ArcGISMap({
        basemap: "satellite",
        ground: "world-elevation"
      });

      const buildingsLayer = new SceneLayer({
        portalItem: { id: "ca0470dbbddb4db28bad74ed39949e25" }
      });
      map3d.add(buildingsLayer);

      scene3dGraphicsLayer = new GraphicsLayer();
      map3d.add(scene3dGraphicsLayer);

      scene3d = new SceneView({
        container: "scene3d",
        map: map3d,
        qualityProfile: "high",
        camera: {
          position: {
            longitude: SHANGHAI_CENTER[1],
            latitude: SHANGHAI_CENTER[0],
            z: 2800
          },
          tilt: 68,
          heading: 28
        }
      });

      scene3d.ui.components = ["zoom", "compass"];

      scene3d.whenLayerView(buildingsLayer).then(
        (layerView) => {
          buildingsLayerView = layerView;
        },
        () => {
          buildingsLayerView = null;
        }
      );

      scene3d.when(
        () => {
          scene3dReady = true;
          refs.scene3dHint.textContent = "已按馆址坐标校准，拖拽可旋转 3D 场景，滚轮可缩放。";
          syncSceneModeUi();

          if (pending3dSpotId) {
            const spotId = pending3dSpotId;
            pending3dSpotId = null;
            updateSpotSceneById(spotId);
          }
        },
        () => {
          refs.scene3dHint.textContent = "3D 场景初始化失败，请稍后重试。";
          if (state.sceneMode === "scene3d") {
            setSceneFallbackNotice("3D 引擎异常，请刷新后重试。");
          }
        }
      );

      scene3d.on("click", () => {
        if (!state.active3dSpotId) {
          return;
        }

        const spot = scenicById.get(state.active3dSpotId);
        if (!spot) {
          return;
        }

        if (!state.selectedSpotId) {
          state.selectedSpotId = spot.id;
          highlightSelectedCard();
        }
      });

      scene3d.updateSpotCamera = async (spot) => {
        const requestId = ++scene3dRequestSeq;
        const sceneConfig = getSpotSceneConfig(spot);
        const mapLng = getSpotSceneAnchorLng(spot);
        const mapLat = getSpotSceneAnchorLat(spot);
        const markerGraphic = new Graphic({
          geometry: {
            type: "point",
            longitude: mapLng,
            latitude: mapLat,
            z: 30
          },
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "icon",
                resource: { primitive: "circle" },
                material: { color: "#d33e30" },
                size: 10,
                outline: {
                  color: "#fff4e8",
                  size: 1.4
                }
              }
            ],
            verticalOffset: {
              screenLength: 24,
              maxWorldLength: 180,
              minWorldLength: 10
            },
            callout: {
              type: "line",
              color: "#d33e30",
              size: 1.8
            }
          },
          attributes: {
            name: spot.name
          }
        });

        scene3dGraphicsLayer.removeAll();
        scene3dGraphicsLayer.add(markerGraphic);

        let target = {
          longitude: mapLng,
          latitude: mapLat,
          altitude: sceneConfig.altitude,
          matchedBuilding: false
        };

        try {
          const nearestBuilding = await queryNearestBuildingModel(buildingsLayer, mapLng, mapLat);
          if (requestId !== scene3dRequestSeq) {
            return;
          }

          if (nearestBuilding) {
            target = {
              longitude: nearestBuilding.longitude,
              latitude: nearestBuilding.latitude,
              altitude: Math.max(sceneConfig.altitude, nearestBuilding.altitude),
              matchedBuilding: true
            };

            if (buildingsHighlightHandle) {
              buildingsHighlightHandle.remove();
              buildingsHighlightHandle = null;
            }

            if (buildingsLayerView && nearestBuilding.objectId != null) {
              buildingsHighlightHandle = buildingsLayerView.highlight([nearestBuilding.objectId]);
            }
          } else {
            if (buildingsHighlightHandle) {
              buildingsHighlightHandle.remove();
              buildingsHighlightHandle = null;
            }
          }
        } catch (error) {
          if (requestId !== scene3dRequestSeq) {
            return;
          }
        }

        scene3d
          .goTo(
            {
              position: {
                longitude: target.longitude,
                latitude: target.latitude,
                z: target.altitude
              },
              heading: sceneConfig.heading,
              tilt: sceneConfig.tilt
            },
            {
              duration: 1400,
              easing: "in-out-cubic"
            }
          )
          .catch(() => {});

        if (requestId !== scene3dRequestSeq) {
          return;
        }

        refs.scene3dHint.textContent = target.matchedBuilding
          ? "已锁定离景点最近的 3D 建筑模型，可继续拖拽微调视角。"
          : "未匹配到近邻建筑模型，已定位到景点中心。";
      };
    }
  );
}

function updateSpot3DById(spotId) {
  const spot = scenicById.get(spotId);
  if (!spot) {
    return;
  }

  state.active3dSpotId = spotId;
  refs.scene3dTitle.textContent = `${spot.name} · 3D 地图`;
  refs.scene3dMeta.textContent = `${spot.type} · ${spot.district} · ${spot.address}`;

  if (!scene3d || !scene3dReady || typeof scene3d.updateSpotCamera !== "function") {
    pending3dSpotId = spotId;
    refs.scene3dHint.textContent = "3D 引擎准备中，稍后会自动切换到该景点。";
    return;
  }

  refs.scene3dHint.textContent = "正在匹配该景点最近的 3D 建筑模型...";
  scene3d.updateSpotCamera(spot);
}

async function updateSpotSceneById(spotId) {
  const spot = scenicById.get(spotId);
  if (!spot) {
    return;
  }

  const requestId = ++sceneRenderRequestSeq;
  state.active3dSpotId = spotId;
  refs.scene3dTitle.textContent = `${spot.name} · 场景视图`;
  refs.scene3dMeta.textContent = `${spot.type} · ${spot.district} · ${spot.address}`;
  setSceneFallbackNotice("");

  if (state.sceneMode === "panorama") {
    const panoramaResult = await tryRenderPanoramaForSpot(spot, requestId);
    if (requestId !== sceneRenderRequestSeq) {
      return;
    }

    if (panoramaResult.ok) {
      if (refs.scene3dHint) {
        refs.scene3dHint.textContent = "已进入全景视图，可切换到 3D 地图查看周边体量。";
      }
      return;
    }

    setSceneFallbackNotice("暂无全景，已自动切换到3D地图视图");
    setSceneMode("scene3d", {
      persistPreference: false,
      refreshActiveSpot: false
    });
    if (refs.scene3dHint && panoramaResult.reasonCode) {
      refs.scene3dHint.textContent = `全景加载失败（${panoramaResult.reasonCode}），已自动切换到 3D 地图。`;
    }
  }

  updateSpot3DById(spotId);
}

function resetScene3D() {
  scene3dRequestSeq += 1;
  sceneRenderRequestSeq += 1;
  state.active3dSpotId = null;
  refs.scene3dTitle.textContent = "景点场景";
  refs.scene3dMeta.textContent = "点击左侧景点后优先显示全景，失败时自动回退到 3D 地图";
  setSceneFallbackNotice("");

  if (refs.scenePanoramaImage) {
    refs.scenePanoramaImage.removeAttribute("src");
    refs.scenePanoramaImage.alt = "景点全景预览";
  }
  if (refs.scenePanoramaMeta) {
    refs.scenePanoramaMeta.textContent = "选择景点后将尝试加载全景";
  }

  if (scene3dGraphicsLayer) {
    scene3dGraphicsLayer.removeAll();
  }

  if (buildingsHighlightHandle) {
    buildingsHighlightHandle.remove();
    buildingsHighlightHandle = null;
  }

  if (scene3d && scene3dReady) {
    scene3d
      .goTo(
        {
          position: {
            longitude: SHANGHAI_CENTER[1],
            latitude: SHANGHAI_CENTER[0],
            z: 2800
          },
          heading: 28,
          tilt: 68
        },
        { duration: 900 }
      )
      .catch(() => {});
  }

  refs.scene3dHint.textContent = "已按馆址坐标校准，拖拽可旋转 3D 场景，滚轮可缩放。";
}

async function shareCurrentView() {
  syncSearchStateFromInput();
  const shareUrl = buildShareUrl();
  if (!shareUrl) {
    setShareHint("当前是本地文件模式（file://），请先用 http(s) 打开后再转发。");
    return;
  }

  const activeRoute = getActiveRoute();
  const sharePayload = {
    title: "上海红色景点可视化",
    text: activeRoute
      ? `我在看“${activeRoute.title}”路线，发你一起看看。`
      : "我整理了一个上海红色景点地图，发你看看。",
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(sharePayload);
      setShareHint("已打开系统分享面板。");
      return;
    }
  } catch (error) {
    if (error && error.name === "AbortError") {
      setShareHint("已取消分享。");
      return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    setShareHint("分享链接已复制，发给朋友即可。");
  } catch (error) {
    if (fallbackCopyText(shareUrl)) {
      setShareHint("分享链接已复制，发给朋友即可。");
      return;
    }

    setShareHint(`复制失败，请手动复制链接：${shareUrl}`);
  }
}

function getPosterModalFocusableElements() {
  if (!refs.posterModal || refs.posterModal.hidden) {
    return [];
  }

  const dialog = refs.posterModal.querySelector(".poster-dialog");
  if (!dialog) {
    return [];
  }

  return Array.from(dialog.querySelectorAll(POSTER_MODAL_FOCUSABLE_SELECTOR)).filter((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    if (element.hasAttribute("disabled")) {
      return false;
    }

    return element.offsetParent !== null || element === document.activeElement;
  });
}

function focusPosterModalPrimaryAction() {
  const focusable = getPosterModalFocusableElements();
  if (focusable.length) {
    focusable[0].focus();
    return;
  }

  const dialog = refs.posterModal?.querySelector(".poster-dialog");
  if (dialog instanceof HTMLElement) {
    dialog.focus();
  }
}

function handlePosterModalKeydown(event) {
  if (event.key !== "Tab" || !refs.posterModal || refs.posterModal.hidden) {
    return;
  }

  const focusable = getPosterModalFocusableElements();
  if (!focusable.length) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !refs.posterModal.contains(active)) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (active === last) {
    event.preventDefault();
    first.focus();
  }
}

async function openPosterModal() {
  syncSearchStateFromInput();
  if (!refs.posterModal || !refs.posterCanvas) {
    setShareHint("海报功能初始化失败，请刷新后重试。");
    return;
  }

  const shareUrl = buildShareUrl();
  if (!shareUrl) {
    setShareHint("当前是本地文件模式（file://），请先用 http(s) 打开后再转发。");
    return;
  }

  lastFocusedElementBeforePosterModal =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  refs.posterModal.style.display = "grid";
  refs.posterModal.hidden = false;
  document.body.style.overflow = "hidden";
  setPosterHint("海报生成中...");
  focusPosterModalPrimaryAction();

  try {
    const posterResult = await renderPosterCanvas(shareUrl);
    if (posterResult?.qrReady === false) {
      setPosterHint("海报已生成，但二维码加载失败，请使用“复制链接”发送给朋友。");
    } else {
      setPosterHint("海报已生成，可下载或截图分享给微信好友。");
    }
  } catch (error) {
    renderPosterFallback(shareUrl);
    setPosterHint("海报生成失败，请稍后重试。");
  }
}

function closePosterModal() {
  if (!refs.posterModal) {
    return;
  }

  const shouldRestoreFocus = !refs.posterModal.hidden;
  refs.posterModal.style.display = "none";
  refs.posterModal.hidden = true;
  document.body.style.overflow = "";

  if (shouldRestoreFocus && lastFocusedElementBeforePosterModal) {
    lastFocusedElementBeforePosterModal.focus();
  }
  lastFocusedElementBeforePosterModal = null;
}

function setPosterHint(message) {
  refs.posterHint.textContent = message;
}

function downloadPosterImage() {
  const canvas = refs.posterCanvas;
  if (!canvas) {
    return;
  }

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `shanghai-red-landmarks-${Date.now()}.png`;
  link.click();
  setPosterHint("海报已下载。");
}

function renderPosterFallback(shareUrl) {
  const canvas = refs.posterCanvas;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) {
    return;
  }

  ctx.fillStyle = "#f7efe1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#8f1a11";
  ctx.font = "700 56px 'Noto Serif SC', serif";
  ctx.fillText("上海红色景点地图", 72, 132);
  ctx.fillStyle = "#5d3028";
  ctx.font = "500 28px 'Noto Serif SC', serif";
  drawWrappedText(ctx, "海报渲染降级模式", 72, 192, canvas.width - 144, 38, 1);
  drawWrappedText(ctx, "请复制下方链接发送给朋友：", 72, 272, canvas.width - 144, 38, 1);
  drawWrappedText(ctx, shareUrl, 72, 332, canvas.width - 144, 34, 10);
}

async function renderPosterCanvas(shareUrl) {
  const canvas = refs.posterCanvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable.");
  }

  const width = canvas.width;
  const height = canvas.height;
  const activeRoute = getActiveRoute();
  const selectedSpot = state.selectedSpotId ? scenicById.get(state.selectedSpotId) : null;
  const filteredSpots = getFilteredSpots();
  const routeInfo = activeRoute ? getRoutePlanInfo(activeRoute) : null;
  const nowLabel = new Date().toLocaleString("zh-CN", { hour12: false });

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, "#f8f0e3");
  bgGradient.addColorStop(0.45, "#f2e2ca");
  bgGradient.addColorStop(1, "#e5c9a6");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const glowGradient = ctx.createRadialGradient(width * 0.82, height * 0.12, 10, width * 0.82, height * 0.12, 320);
  glowGradient.addColorStop(0, "rgba(197, 58, 37, 0.35)");
  glowGradient.addColorStop(1, "rgba(197, 58, 37, 0)");
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#8f1a11";
  ctx.font = "700 58px 'Noto Serif SC', serif";
  ctx.fillText("上海红色景点地图", 66, 122);
  ctx.fillStyle = "#5b2f25";
  ctx.font = "500 28px 'Noto Serif SC', serif";
  ctx.fillText("Red Landmarks · Share Poster", 66, 168);

  ctx.fillStyle = "rgba(255, 248, 239, 0.92)";
  roundRect(ctx, 52, 216, width - 104, 598, 24);
  ctx.fill();

  ctx.fillStyle = "#5d3028";
  ctx.font = "700 30px 'Noto Serif SC', serif";
  ctx.fillText("当前视图摘要", 86, 282);
  ctx.font = "500 24px 'Noto Serif SC', serif";
  drawWrappedText(
    ctx,
    `路线：${activeRoute ? activeRoute.title : "未选择路线"}`,
    86,
    334,
    width - 170,
    36,
    2
  );
  drawWrappedText(
    ctx,
    `景点：${selectedSpot ? selectedSpot.name : "未锁定景点"}  ·  当前筛选结果 ${filteredSpots.length} 个`,
    86,
    396,
    width - 170,
    36,
    2
  );
  drawWrappedText(
    ctx,
    `路线用时：${routeInfo ? formatDuration(routeInfo.totalMinutes) : "未计算"}  ·  数据来源：${routeInfo ? getPlanSourceLabel(routeInfo) : "未选择路线"}`,
    86,
    458,
    width - 170,
    36,
    2
  );
  drawWrappedText(ctx, `更新时间：${nowLabel}`, 86, 520, width - 170, 36, 1);
  drawWrappedText(
    ctx,
    "打开链接可继续查看地图、路线和 3D 视角。建议在微信中发送海报和链接一起给朋友。",
    86,
    584,
    width - 170,
    36,
    3
  );

  ctx.fillStyle = "rgba(255, 248, 239, 0.94)";
  roundRect(ctx, 52, 848, width - 104, 700, 24);
  ctx.fill();

  const qrDataUrl = await generateQrCodeDataUrl(shareUrl);
  const qrSize = 300;
  const qrX = 88;
  const qrY = 928;

  if (qrDataUrl) {
    const qrImage = await loadImage(qrDataUrl);
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
    canvas.dataset.qrStatus = "ok";
  } else {
    ctx.fillStyle = "#f1dfca";
    roundRect(ctx, qrX, qrY, qrSize, qrSize, 20);
    ctx.fill();
    ctx.fillStyle = "#884338";
    ctx.font = "500 22px 'Noto Serif SC', serif";
    ctx.fillText("二维码不可用", qrX + 78, qrY + 164);
    canvas.dataset.qrStatus = "fallback";
  }

  ctx.fillStyle = "#5d3028";
  ctx.font = "700 30px 'Noto Serif SC', serif";
  ctx.fillText("扫码继续查看", 430, 980);
  ctx.font = "500 24px 'Noto Serif SC', serif";
  drawWrappedText(
    ctx,
    shareUrl,
    430,
    1038,
    width - 484,
    33,
    8
  );

  return {
    qrReady: Boolean(qrDataUrl)
  };
}

async function generateQrCodeDataUrl(text) {
  if (window.QRCode && typeof window.QRCode.toDataURL === "function") {
    return await window.QRCode.toDataURL(text, {
      width: 360,
      margin: 1,
      color: {
        dark: "#7e1b13",
        light: "#fffaf4"
      }
    });
  }

  if (typeof window.qrcode === "function") {
    try {
      const qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      return qr.createDataURL(8, 1);
    } catch (error) {
      return "";
    }
  }

  return "";
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed."));
    image.src = src;
  });
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = Array.from(text || "");
  let current = "";
  let line = 0;

  for (let i = 0; i < chars.length; i += 1) {
    const next = `${current}${chars[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }

    ctx.fillText(current, x, y + line * lineHeight);
    line += 1;
    current = chars[i];

    if (line >= maxLines) {
      break;
    }
  }

  if (line < maxLines && current) {
    ctx.fillText(current, x, y + line * lineHeight);
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const corner = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + corner, y);
  ctx.lineTo(x + width - corner, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + corner);
  ctx.lineTo(x + width, y + height - corner);
  ctx.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  ctx.lineTo(x + corner, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - corner);
  ctx.lineTo(x, y + corner);
  ctx.quadraticCurveTo(x, y, x + corner, y);
  ctx.closePath();
}

function buildShareUrl() {
  if (window.location.protocol === "file:") {
    return null;
  }

  const url = new URL(window.location.href);
  const params = new URLSearchParams();

  params.set("v", URL_VERSION);

  if (state.search) {
    params.set("q", state.search);
  }

  if (state.district !== "all") {
    params.set("district", state.district);
  }

  if (state.type !== "all") {
    params.set("type", state.type);
  }

  if (state.activeRouteId) {
    params.set("route", state.activeRouteId);
  }

  if (state.selectedSpotId) {
    params.set("spot", state.selectedSpotId);
  }

  if (state.sceneMode === "scene3d") {
    params.set("sceneMode", "scene3d");
  }

  const center = getMapCenter();
  params.set("lat", center.lat.toFixed(5));
  params.set("lng", center.lng.toFixed(5));
  params.set("z", String(getMapZoom()));

  url.search = params.toString();
  url.hash = "";
  return url.toString();
}

function syncUrlState() {
  const nextUrl = buildShareUrl();
  if (nextUrl && nextUrl !== window.location.href) {
    history.replaceState(null, "", nextUrl);
  }
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.size) {
    return;
  }

  const searchValue = params.get("q");
  if (searchValue) {
    state.search = searchValue.trim();
  }

  const district = params.get("district");
  if (district && scenicSpots.some((spot) => spot.district === district)) {
    state.district = district;
  }

  const type = params.get("type");
  if (type && scenicSpots.some((spot) => spot.type === type)) {
    state.type = type;
  }

  const routeId = params.get("route");
  if (routeId && recommendedRoutes.some((route) => route.id === routeId)) {
    state.activeRouteId = routeId;
  }

  const spotId = params.get("spot");
  if (spotId && scenicById.has(spotId)) {
    state.selectedSpotId = spotId;
  }

  const sceneMode = params.get("sceneMode");
  if (sceneMode === "panorama" || sceneMode === "scene3d") {
    state.sceneMode = sceneMode;
  }

  const lat = Number.parseFloat(params.get("lat"));
  const lng = Number.parseFloat(params.get("lng"));
  const zoom = Number.parseInt(params.get("z"), 10);

  if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(zoom)) {
    const clampedCenter = clampLatLngToShanghaiBounds(lat, lng);
    pendingMapView = {
      lat: clampedCenter.lat,
      lng: clampedCenter.lng,
      zoom: clampMapZoom(zoom)
    };

    if (mapReady) {
      setMapView(pendingMapView.lat, pendingMapView.lng, pendingMapView.zoom, false);
    }
  }
}

function syncControlValues() {
  refs.searchInput.value = state.search;
  refs.districtSelect.value = state.district;
  refs.typeSelect.value = state.type;
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function setShareHint(message) {
  refs.shareHint.textContent = message;
}

function showShareProtocolHint() {
  if (window.location.protocol === "file:") {
    setShareHint("当前为 file:// 本地模式，微信转发请先改为 http(s) 链接。");
  }
}

function getSpotMapLat(spot) {
  if (Number.isFinite(spot?.mapLat)) {
    return spot.mapLat;
  }
  return spot?.lat ?? SHANGHAI_CENTER[0];
}

function getSpotMapLng(spot) {
  if (Number.isFinite(spot?.mapLng)) {
    return spot.mapLng;
  }
  return spot?.lng ?? SHANGHAI_CENTER[1];
}

function getSpotSceneConfig(spot) {
  return {
    heading: 36,
    tilt: 72,
    altitude: 900,
    anchorOffsetLat: 0,
    anchorOffsetLng: 0,
    ...(spot?.scene || {})
  };
}

function getSpotSceneAnchorLat(spot) {
  const config = getSpotSceneConfig(spot);
  return getSpotMapLat(spot) + config.anchorOffsetLat;
}

function getSpotSceneAnchorLng(spot) {
  const config = getSpotSceneConfig(spot);
  return getSpotMapLng(spot) + config.anchorOffsetLng;
}

async function queryNearestBuildingModel(buildingsLayer, longitude, latitude) {
  if (!buildingsLayer || typeof buildingsLayer.createQuery !== "function") {
    return null;
  }

  const query = buildingsLayer.createQuery();
  query.geometry = {
    type: "point",
    longitude,
    latitude,
    spatialReference: { wkid: 4326 }
  };
  query.distance = 150;
  query.units = "meters";
  query.returnGeometry = true;
  query.outFields = ["*"];
  query.num = 24;

  const result = await buildingsLayer.queryFeatures(query);
  const features = result?.features || [];
  if (!features.length) {
    return null;
  }

  let nearest = null;
  features.forEach((feature) => {
    const center = getFeatureCenter(feature?.geometry);
    if (!center) {
      return;
    }

    const distanceKm = haversine(
      { mapLat: latitude, mapLng: longitude },
      { mapLat: center.latitude, mapLng: center.longitude }
    );

    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = {
        distanceKm,
        longitude: center.longitude,
        latitude: center.latitude,
        altitude: getFeatureCameraAltitude(feature),
        objectId: getFeatureObjectId(feature)
      };
    }
  });

  return nearest;
}

function getFeatureCenter(geometry) {
  if (!geometry) {
    return null;
  }

  if (
    geometry.type === "point" &&
    Number.isFinite(geometry.longitude) &&
    Number.isFinite(geometry.latitude)
  ) {
    return {
      longitude: geometry.longitude,
      latitude: geometry.latitude
    };
  }

  if (geometry.extent?.center) {
    const center = geometry.extent.center;
    if (Number.isFinite(center.longitude) && Number.isFinite(center.latitude)) {
      return {
        longitude: center.longitude,
        latitude: center.latitude
      };
    }
  }

  if (Array.isArray(geometry.rings) && geometry.rings.length) {
    const ring = geometry.rings[0];
    if (Array.isArray(ring) && ring.length) {
      let lngSum = 0;
      let latSum = 0;
      let count = 0;
      ring.forEach((point) => {
        const lng = point?.[0];
        const lat = point?.[1];
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          lngSum += lng;
          latSum += lat;
          count += 1;
        }
      });

      if (count) {
        return {
          longitude: lngSum / count,
          latitude: latSum / count
        };
      }
    }
  }

  return null;
}

function getFeatureCameraAltitude(feature) {
  const attrs = feature?.attributes || {};
  const candidates = [
    attrs.height,
    attrs.Height,
    attrs.HEIGHT,
    attrs.height_m,
    attrs.HEIGHT_M,
    attrs.ROOFHEIGHT,
    attrs.BLDGHEIGHT,
    attrs.HGT
  ];

  for (const value of candidates) {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.max(420, Math.min(1200, Math.round(parsed * 6)));
    }
  }

  return 760;
}

function getFeatureObjectId(feature) {
  const attrs = feature?.attributes || {};
  const objectIdKeys = ["OBJECTID", "ObjectId", "objectid", "FID", "fid"];

  for (const key of objectIdKeys) {
    const value = Number.parseInt(attrs[key], 10);
    if (Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function haversine(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const latA = getSpotMapLat(a);
  const lngA = getSpotMapLng(a);
  const latB = getSpotMapLat(b);
  const lngB = getSpotMapLng(b);

  const dLat = toRad(latB - latA);
  const dLng = toRad(lngB - lngA);

  const lat1 = toRad(latA);
  const lat2 = toRad(latB);

  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const angle = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return earthRadiusKm * angle;
}
