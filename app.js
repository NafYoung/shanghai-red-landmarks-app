const SHANGHAI_CENTER = [31.23234, 121.46918];
const SHANGHAI_ZOOM = 11;
const URL_VERSION = "1";
const ROUTE_START_MINUTE = 9 * 60 + 30;
const URBAN_TRAVEL_SPEED_KMH = 22;
const TRANSFER_BUFFER_MINUTES = 8;
const ROUTE_FETCH_TIMEOUT_MS = 5500;
const REAL_ROUTE_ENGINE_URL = "https://router.project-osrm.org";
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
    keywords: ["八百壮士", "淞沪会战", "抗战"]
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
    keywords: ["建党", "初心", "石库门"]
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
    keywords: ["党章", "早期党史"]
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
    keywords: ["统一战线", "党史"]
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
    keywords: ["烈士", "纪念"]
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
    keywords: ["淞沪抗战", "抗日"]
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
    keywords: ["义勇军进行曲", "聂耳", "田汉"]
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
    keywords: ["鲁迅", "左翼文化"]
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
    keywords: ["宋庆龄", "名人故居"]
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
    keywords: ["陈云", "青浦"]
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
    keywords: ["青年团", "团中央旧址"]
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
  active3dSpotId: null
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
  scene3dTitle: document.getElementById("scene3dTitle"),
  scene3dMeta: document.getElementById("scene3dMeta"),
  scene3dHint: document.getElementById("scene3dHint"),
  posterModal: document.getElementById("posterModal"),
  posterCanvas: document.getElementById("posterCanvas"),
  closePoster: document.getElementById("closePoster"),
  downloadPoster: document.getElementById("downloadPoster"),
  copyPosterLink: document.getElementById("copyPosterLink"),
  posterHint: document.getElementById("posterHint")
};

let map = null;
let mapReady = false;
let pendingMapView = null;
let mapMoveEndBound = false;
let routeLayer = null;
const markerById = new Map();
const scenicById = new Map(scenicSpots.map((spot) => [spot.id, spot]));
let scene3d = null;
let scene3dGraphicsLayer = null;
let scene3dReady = false;
let pending3dSpotId = null;
let scene3dRequestSeq = 0;
let buildingsLayerView = null;
let buildingsHighlightHandle = null;
const routeLegMetricsCache = new Map();
const routeLegMetricsInFlight = new Set();
let routeMetricsLoading = false;
let routeMetricsStatusNote = "";
let routeMetricsRequestSeq = 0;
let lastRouteMetricsRouteId = null;

initSelects();
hydrateStateFromUrl();
renderRouteCards();
bindEvents();
syncControlValues();
showShareProtocolHint();
initMap();
initScene3D();
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
  refs.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    updateView();
  });

  refs.districtSelect.addEventListener("change", (event) => {
    state.district = event.target.value;
    updateView();
  });

  refs.typeSelect.addEventListener("change", (event) => {
    state.type = event.target.value;
    updateView();
  });

  refs.resetFilters.addEventListener("click", () => {
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
    setMapView(SHANGHAI_CENTER[0], SHANGHAI_CENTER[1], SHANGHAI_ZOOM, true);
  });

  refs.shareApp.addEventListener("click", async () => {
    await shareCurrentView();
  });

  if (refs.makePoster) {
    refs.makePoster.addEventListener("click", async () => {
      await openPosterModal();
    });
  }

  refs.clearRoute.addEventListener("click", () => {
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && refs.posterModal && !refs.posterModal.hidden) {
      closePosterModal();
    }
  });

  bindMapMoveEnd();
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
      updateSpot3DById(fallbackSpotId);
    }
    updateMapSpotInfo(scenicById.get(fallbackSpotId) || null);
  } else {
    resetScene3D();
    updateMapSpotInfo(null);
  }
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
    const card = document.createElement("article");
    card.className = "scenic-item";
    card.dataset.id = spot.id;

    if (state.selectedSpotId === spot.id) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <div class="item-head">
        <h4>${spot.name}</h4>
        <span class="tag">${spot.district}</span>
      </div>
      <p class="item-brief">${spot.brief}</p>
      <p class="item-address">地址：${spot.address}</p>
      <p class="item-intro">${spot.intro}</p>
      <div class="item-meta">
        <span class="meta-chip">${spot.type}</span>
        <span class="meta-chip">关联年份 ${spot.year}</span>
      </div>
      <button type="button" class="link-btn">地图定位</button>
    `;

    card.addEventListener("click", () => {
      focusSpot(spot.id, true);
    });

    const locateButton = card.querySelector(".link-btn");
    locateButton.addEventListener("click", (event) => {
      event.stopPropagation();
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

  markerById.forEach((marker) => {
    marker.remove();
  });
  markerById.clear();

  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }

  const markerIcon = createMarkerIcon();
  spots.forEach((spot) => {
    const marker = window.L.marker([getSpotMapLat(spot), getSpotMapLng(spot)], { icon: markerIcon });
    marker.bindPopup(getSpotPopupHtml(spot), {
      className: "spot-popup",
      maxWidth: 320
    });
    marker.on("click", () => {
      state.selectedSpotId = spot.id;
      highlightSelectedCard();
      updateSpot3DById(spot.id);
      updateMapSpotInfo(spot);
      syncUrlState();
    });

    marker.addTo(map);
    markerById.set(spot.id, marker);

    if (state.selectedSpotId === spot.id) {
      marker.openPopup();
    }
  });

  drawActiveRoute(spots);
}

function drawActiveRoute(filteredSpots) {
  if (!mapReady || typeof window.L === "undefined") {
    return;
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
    card.innerHTML = `
      <h4>${route.title}</h4>
      <p>${route.description}</p>
      <div class="route-meta">
        <span class="meta-chip">${route.spotIds.length} 个点 · 约 ${planInfo.totalDistanceKm.toFixed(1)} km · ${formatDuration(planInfo.totalMinutes)} · ${sourceLabel}</span>
        <button class="button" type="button">查看路线</button>
      </div>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
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
  summary.innerHTML = `
    <h4>${activeRoute.title} · 打卡计划</h4>
    <p>停留约 ${formatDuration(planInfo.totalVisitMinutes)}，路途约 ${formatDuration(planInfo.totalTravelMinutes)}。</p>
    <p>路线数据：${getPlanSourceLabel(planInfo)}</p>
    <div class="plan-summary-meta">
      <span class="meta-chip">建议出发 ${formatClock(planInfo.startMinute)}</span>
      <span class="meta-chip">预计完成 ${formatClock(planInfo.endMinute)}</span>
      <span class="meta-chip">总里程 ${planInfo.totalDistanceKm.toFixed(1)} km</span>
      <span class="meta-chip">总用时 ${formatDuration(planInfo.totalMinutes)}</span>
    </div>
  `;

  const steps = document.createElement("div");
  steps.className = "plan-steps";

  planInfo.steps.forEach((step) => {
    const item = document.createElement("article");
    item.className = "plan-step";

    const sourceTag = step.nextTransfer
      ? `<span class="plan-step-source">${step.nextTransfer.source === "real" ? "真实路网" : "估算"}</span>`
      : "";

    const transferLine = step.nextTransfer
      ? `下一站：${step.nextTransfer.nextSpotName} · 约 ${step.nextTransfer.distanceKm.toFixed(1)} km / ${step.nextTransfer.travelMinutes} 分钟（${step.nextTransfer.transitMode}）${sourceTag}`
      : "终点站：本路线打卡完成。";

    item.innerHTML = `
      <h5>${step.order}. ${step.spot.name}</h5>
      <p>到达 ${formatClock(step.arrivalMinute)}，建议停留 ${step.visitMinutes} 分钟，预计离开 ${formatClock(step.leaveMinute)}。</p>
      <p class="plan-step-transfer">${transferLine}</p>
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
  updateSpot3DById(spotId);
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

function getRouteLegMetrics(fromSpot, toSpot) {
  const cacheKey = getRouteLegCacheKey(fromSpot, toSpot);
  const cached = routeLegMetricsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const distanceKm = haversine(fromSpot, toSpot);
  return {
    distanceKm,
    travelMinutes: getTravelMinutes(distanceKm),
    transitMode: getTransitMode(distanceKm),
    source: "estimated"
  };
}

function getPlanSourceLabel(planInfo) {
  if (!planInfo.totalLegCount) {
    return "无路段数据";
  }

  if (planInfo.realLegCount === planInfo.totalLegCount) {
    return "真实路网";
  }

  if (planInfo.realLegCount === 0) {
    return "估算";
  }

  return `混合（真实 ${planInfo.realLegCount}/${planInfo.totalLegCount}）`;
}

function renderRouteDataHint() {
  if (!refs.routeDataHint) {
    return;
  }

  refs.routeDataHint.classList.remove("loading", "partial");

  const activeRoute = getActiveRoute();
  if (!activeRoute) {
    refs.routeDataHint.textContent = "路线时间默认按城市速度估算。";
    return;
  }

  const planInfo = getRoutePlanInfo(activeRoute);
  if (routeMetricsLoading) {
    refs.routeDataHint.textContent = "正在加载真实路网里程与时间...";
    refs.routeDataHint.classList.add("loading");
    return;
  }

  if (planInfo.realLegCount === planInfo.totalLegCount && planInfo.totalLegCount > 0) {
    refs.routeDataHint.textContent = "当前路线已使用真实路网时间。";
    return;
  }

  if (routeMetricsStatusNote) {
    refs.routeDataHint.textContent = routeMetricsStatusNote;
    refs.routeDataHint.classList.add("partial");
    return;
  }

  refs.routeDataHint.textContent = `当前路线有 ${planInfo.realLegCount}/${planInfo.totalLegCount} 段已获取真实路网时间。`;
  if (planInfo.realLegCount < planInfo.totalLegCount) {
    refs.routeDataHint.classList.add("partial");
  }
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
    if (!routeLegMetricsCache.has(cacheKey) && !routeLegMetricsInFlight.has(cacheKey)) {
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
      routeLegMetricsCache.set(cacheKey, metrics);
    } catch (error) {
      const fallbackDistance = haversine(fromSpot, toSpot);
      routeLegMetricsCache.set(cacheKey, {
        distanceKm: fallbackDistance,
        travelMinutes: getTravelMinutes(fallbackDistance),
        transitMode: getTransitMode(fallbackDistance),
        source: "estimated"
      });
      routeMetricsStatusNote = "部分路段获取真实路网失败，已回退为估算。";
    } finally {
      routeLegMetricsInFlight.delete(cacheKey);
    }
  });

  Promise.allSettled(fetchTasks).then(() => {
    if (currentRequestSeq !== routeMetricsRequestSeq) {
      return;
    }

    routeMetricsLoading = false;
    updateView();
  });
}

async function fetchRouteLegMetrics(fromSpot, toSpot) {
  const straightDistanceKm = haversine(fromSpot, toSpot);
  const profile = chooseRouteProfile(straightDistanceKm);
  const fromLng = getSpotMapLng(fromSpot);
  const fromLat = getSpotMapLat(fromSpot);
  const toLng = getSpotMapLng(toSpot);
  const toLat = getSpotMapLat(toSpot);

  const routeUrl = `${REAL_ROUTE_ENGINE_URL}/route/v1/${profile}/${fromLng},${fromLat};${toLng},${toLat}?overview=false&alternatives=false&steps=false&continue_straight=true`;
  const data = await fetchJsonWithTimeout(routeUrl, ROUTE_FETCH_TIMEOUT_MS);

  if (!data || data.code !== "Ok" || !Array.isArray(data.routes) || !data.routes.length) {
    throw new Error("Route engine returned invalid payload.");
  }

  const firstRoute = data.routes[0];
  const distanceKm = (firstRoute.distance || 0) / 1000;
  const travelMinutes = Math.max(3, Math.round((firstRoute.duration || 0) / 60));

  return {
    distanceKm,
    travelMinutes,
    transitMode: getTransitModeByProfile(profile, distanceKm),
    source: "real"
  };
}

function chooseRouteProfile(straightDistanceKm) {
  if (straightDistanceKm <= 2.5) {
    return "walking";
  }

  if (straightDistanceKm <= 8) {
    return "cycling";
  }

  return "driving";
}

function getTransitModeByProfile(profile, distanceKm) {
  if (profile === "walking") {
    return "步行";
  }

  if (profile === "cycling") {
    return "骑行";
  }

  if (distanceKm > 15) {
    return "驾车/网约车";
  }

  return "驾车";
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

function getRoutePlanInfo(route) {
  const routeSpots = route.spotIds.map((id) => scenicById.get(id)).filter(Boolean);
  const steps = [];

  if (!routeSpots.length) {
    return {
      steps,
      totalDistanceKm: 0,
      totalVisitMinutes: 0,
      totalTravelMinutes: 0,
      totalMinutes: 0,
      totalLegCount: 0,
      realLegCount: 0,
      estimatedLegCount: 0,
      startMinute: ROUTE_START_MINUTE,
      endMinute: ROUTE_START_MINUTE
    };
  }

  let totalDistanceKm = 0;
  let totalVisitMinutes = 0;
  let totalTravelMinutes = 0;
  let realLegCount = 0;
  let estimatedLegCount = 0;
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

      totalDistanceKm += legMetrics.distanceKm;
      totalTravelMinutes += legMetrics.travelMinutes;
      currentMinute = leaveMinute + legMetrics.travelMinutes;

      if (legMetrics.source === "real") {
        realLegCount += 1;
      } else {
        estimatedLegCount += 1;
      }

      nextTransfer = {
        nextSpotName: nextSpot.name,
        distanceKm: legMetrics.distanceKm,
        travelMinutes: legMetrics.travelMinutes,
        transitMode: legMetrics.transitMode,
        source: legMetrics.source
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
    totalDistanceKm,
    totalVisitMinutes,
    totalTravelMinutes,
    totalMinutes,
    totalLegCount: Math.max(routeSpots.length - 1, 0),
    realLegCount,
    estimatedLegCount,
    startMinute: ROUTE_START_MINUTE,
    endMinute: ROUTE_START_MINUTE + totalMinutes
  };
}

function getVisitMinutes(type) {
  return STOP_TIME_BY_TYPE[type] || 60;
}

function getTravelMinutes(distanceKm) {
  const movingMinutes = (distanceKm / URBAN_TRAVEL_SPEED_KMH) * 60;
  return Math.max(8, Math.round(movingMinutes + TRANSFER_BUFFER_MINUTES));
}

function getTransitMode(distanceKm) {
  if (distanceKm <= 2) {
    return "步行/骑行";
  }

  if (distanceKm <= 8) {
    return "地铁";
  }

  if (distanceKm <= 15) {
    return "地铁+步行";
  }

  return "打车/网约车";
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
      minZoom: 4,
      maxZoom: 19,
      preferCanvas: true
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

    mapReady = true;
    clearMapUnavailable();
    bindMapMoveEnd();
    updateView();
  } catch (error) {
    showMapUnavailable("地图初始化失败，请刷新后重试。");
  }
}

function clampMapZoom(zoom) {
  if (!Number.isFinite(zoom)) {
    return SHANGHAI_ZOOM;
  }

  return Math.max(9, Math.min(16, Math.round(zoom)));
}

function bindMapMoveEnd() {
  if (!mapReady || !map || mapMoveEndBound) {
    return;
  }

  map.on("moveend", () => {
    syncUrlState();
  });

  mapMoveEndBound = true;
}

function setMapView(lat, lng, zoom, animated) {
  pendingMapView = {
    lat,
    lng,
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
    return {
      lat: center.lat,
      lng: center.lng
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

  refs.mapSpotInfo.innerHTML = `
    <h4>${spot.name}</h4>
    <p><strong>地址：</strong>${spot.address}</p>
    <p><strong>坐标：</strong>${getSpotMapLat(spot).toFixed(6)}, ${getSpotMapLng(spot).toFixed(6)}</p>
    <p>${spot.intro}</p>
  `;
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

          if (pending3dSpotId) {
            const spotId = pending3dSpotId;
            pending3dSpotId = null;
            updateSpot3DById(spotId);
          }
        },
        () => {
          refs.scene3dHint.textContent = "3D 场景初始化失败，请稍后重试。";
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
  refs.scene3dTitle.textContent = `${spot.name} · 3D 图`;
  refs.scene3dMeta.textContent = `${spot.type} · ${spot.district} · ${spot.address}`;

  if (!scene3d || !scene3dReady || typeof scene3d.updateSpotCamera !== "function") {
    pending3dSpotId = spotId;
    refs.scene3dHint.textContent = "3D 引擎准备中，稍后会自动切换到该景点。";
    return;
  }

  refs.scene3dHint.textContent = "正在匹配该景点最近的 3D 建筑模型...";
  scene3d.updateSpotCamera(spot);
}

function resetScene3D() {
  scene3dRequestSeq += 1;
  state.active3dSpotId = null;
  refs.scene3dTitle.textContent = "景点 3D 图";
  refs.scene3dMeta.textContent = "点击左侧景点后显示该地点 3D 视角";

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

async function openPosterModal() {
  if (!refs.posterModal || !refs.posterCanvas) {
    setShareHint("海报功能初始化失败，请刷新后重试。");
    return;
  }

  const shareUrl = buildShareUrl();
  if (!shareUrl) {
    setShareHint("当前是本地文件模式（file://），请先用 http(s) 打开后再转发。");
    return;
  }

  refs.posterModal.style.display = "grid";
  refs.posterModal.hidden = false;
  document.body.style.overflow = "hidden";
  setPosterHint("海报生成中...");

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

  refs.posterModal.style.display = "none";
  refs.posterModal.hidden = true;
  document.body.style.overflow = "";
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

  const lat = Number.parseFloat(params.get("lat"));
  const lng = Number.parseFloat(params.get("lng"));
  const zoom = Number.parseInt(params.get("z"), 10);

  if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(zoom)) {
    pendingMapView = {
      lat,
      lng,
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
