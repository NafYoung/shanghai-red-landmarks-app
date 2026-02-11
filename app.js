const SHANGHAI_CENTER = [31.2304, 121.4737];
const SHANGHAI_ZOOM = 11;
const URL_VERSION = "1";
const ROUTE_START_MINUTE = 9 * 60 + 30;
const URBAN_TRAVEL_SPEED_KMH = 22;
const TRANSFER_BUFFER_MINUTES = 8;
const STOP_TIME_BY_TYPE = {
  中共会址: 70,
  抗战遗址: 80,
  烈士纪念: 75,
  人物纪念: 60,
  展陈场馆: 55
};

const scenicSpots = [
  {
    id: "sihang",
    name: "四行仓库抗战纪念馆",
    district: "静安区",
    type: "抗战遗址",
    year: 1937,
    lat: 31.2474,
    lng: 121.4626,
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
    lat: 31.2199,
    lng: 121.4753,
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
    lat: 31.2292,
    lng: 121.4635,
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
    lat: 31.2719,
    lng: 121.4878,
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
    lat: 31.173,
    lng: 121.4475,
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
    lat: 31.4064,
    lng: 121.4899,
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
    lat: 31.2644,
    lng: 121.527,
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
    lat: 31.2866,
    lng: 121.4852,
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
    lat: 31.2106,
    lng: 121.4335,
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
    lat: 31.1638,
    lng: 121.0605,
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
    lat: 31.2214,
    lng: 121.4807,
    address: "黄浦区淮海中路567弄1-6号（2号门）",
    brief: "中国社会主义青年团中央机关旧址。",
    intro:
      "该旧址见证了早期青年运动和社会主义青年团的组织建设。展区围绕青年群体的觉醒、传播与行动，呈现城市革命网络形成过程。",
    keywords: ["青年团", "团中央旧址"]
  }
];

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
  shareHint: document.getElementById("shareHint"),
  clearRoute: document.getElementById("clearRoute"),
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
  scene3dHint: document.getElementById("scene3dHint")
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

  refs.clearRoute.addEventListener("click", () => {
    state.activeRouteId = null;
    updateView();
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
  renderRoutePlan();
  syncRouteCardState();
  syncUrlState();

  const fallbackSpotId = state.selectedSpotId || filtered[0]?.id || null;
  if (fallbackSpotId) {
    updateSpot3DById(fallbackSpotId);
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
    const marker = window.L.marker([spot.lat, spot.lng], { icon: markerIcon });
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
    routeSpots.map((spot) => [spot.lat, spot.lng]),
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
    card.innerHTML = `
      <h4>${route.title}</h4>
      <p>${route.description}</p>
      <div class="route-meta">
        <span class="meta-chip">${route.spotIds.length} 个点 · 约 ${planInfo.totalDistanceKm.toFixed(1)} km · ${formatDuration(planInfo.totalMinutes)}</span>
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

    const transferLine = step.nextTransfer
      ? `下一站：${step.nextTransfer.nextSpotName} · 约 ${step.nextTransfer.distanceKm.toFixed(1)} km / ${step.nextTransfer.travelMinutes} 分钟（${step.nextTransfer.transitMode}）`
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
    setMapView(spot.lat, spot.lng, 13, true);
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
      startMinute: ROUTE_START_MINUTE,
      endMinute: ROUTE_START_MINUTE
    };
  }

  let totalDistanceKm = 0;
  let totalVisitMinutes = 0;
  let totalTravelMinutes = 0;
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
      const distanceKm = haversine(spot, nextSpot);
      const travelMinutes = getTravelMinutes(distanceKm);

      totalDistanceKm += distanceKm;
      totalTravelMinutes += travelMinutes;
      currentMinute = leaveMinute + travelMinutes;

      nextTransfer = {
        nextSpotName: nextSpot.name,
        distanceKm,
        travelMinutes,
        transitMode: getTransitMode(distanceKm)
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
  return `
    <div class="popup-body">
      <h4>${spot.name}</h4>
      <p class="popup-meta">${spot.type} · ${spot.district}</p>
      <p class="popup-address">地址：${spot.address}</p>
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
    setMapView(spots[0].lat, spots[0].lng, 13, true);
    return;
  }

  const bounds = window.L.latLngBounds(spots.map((spot) => [spot.lat, spot.lng]));
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

      scene3d.when(
        () => {
          scene3dReady = true;
          refs.scene3dHint.textContent = "拖拽可旋转 3D 场景，滚轮可缩放。";

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

      scene3d.updateSpotCamera = (spot) => {
        const markerGraphic = new Graphic({
          geometry: {
            type: "point",
            longitude: spot.lng,
            latitude: spot.lat,
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

        scene3d
          .goTo(
            {
              position: {
                longitude: spot.lng,
                latitude: spot.lat,
                z: 1100
              },
              heading: 36,
              tilt: 72
            },
            {
              duration: 1400,
              easing: "in-out-cubic"
            }
          )
          .catch(() => {});
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

  refs.scene3dHint.textContent = "拖拽可旋转 3D 场景，滚轮可缩放。";
  scene3d.updateSpotCamera(spot);
}

function resetScene3D() {
  state.active3dSpotId = null;
  refs.scene3dTitle.textContent = "景点 3D 图";
  refs.scene3dMeta.textContent = "点击左侧景点后显示该地点 3D 视角";

  if (scene3dGraphicsLayer) {
    scene3dGraphicsLayer.removeAll();
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

  refs.scene3dHint.textContent = "拖拽可旋转 3D 场景，滚轮可缩放。";
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

function haversine(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const angle = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return earthRadiusKm * angle;
}
