let map;
let routingControl = null;
let currentRoute = null;
let roadMarkers = [];
let isRoadDistanceMode = false;
let isDirectDistanceMode = false;
let roadDistanceLabels = [];
let measureLayer = null;
let measureLabel = null;
let roadDistanceTooltip = null;
let routeLine = null;

let measureControl;
let measurePoints = [];
let directDistanceTooltip = null;
let tempLine = null;
let tempLabel = null;

// 새로 추가할 전역 변수
let startMarker = null;
let endMarker = null;

// 전역 변수 추가
let measureMarkers = [];
let measureLines = [];
let totalDistanceLabel = null;
let totalDistance = 0;

// 전역 변수로 이벤트 리스너가 등록되었는지 확인하는 플래그 추가
let isKeyboardListenerAdded = false;

// 전역 변수로 레이블을 저장할 변수 추가
let startLabel = null;
let endLabel = null;

function initializeMeasureControl() {
    const MeasureControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function () {
            // 버튼 생성 부분을 제거합니다.
            return L.DomUtil.create('div', 'dummy-measure-control');
        },
        toggleMeasure: function () {
            if (!this.measuring) {
                this.startMeasure();
            } else {
                this.stopMeasure();
            }
        },
        startMeasure: function () {
            this.measuring = true;
            measurePoints = [];
            this.resetMeasureLayer();
            map.on('mousemove', this.updateTempLine, this);
        },
        stopMeasure: function () {
            this.measuring = false;
            map.off('mousemove', this.updateTempLine, this);
            if (tempLine) {
                map.removeLayer(tempLine);
                tempLine = null;
            }
            if (tempLabel) {
                map.removeLayer(tempLabel);
                tempLabel = null;
            }
            this.resetMeasureLayer();
        },
        resetMeasureLayer: function () {
            if (measureLayer) {
                map.removeLayer(measureLayer);
            }
            measureLayer = L.layerGroup().addTo(map);
        },
        disable: function () {
            this.stopMeasure();
            isDirectDistanceMode = false;
            map.off('click', onMapClickForDirectDistance);
            this.clearAllMeasurements();
        },
        clearAllMeasurements: function () {
            if (measureLayer) {
                measureLayer.clearLayers();
            }
            measurePoints.forEach(point => {
                if (point.marker) {
                    map.removeLayer(point.marker);
                }
            });
            measurePoints = [];
            if (tempLine) {
                map.removeLayer(tempLine);
                tempLine = null;
            }
            if (tempLabel) {
                map.removeLayer(tempLabel);
                tempLabel = null;
            }
            map.eachLayer(function (layer) {
                if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.Tooltip) {
                    if (layer.options.className === 'measure-label' || (layer._tooltip && layer._tooltip.options.className === 'measure-label')) {
                        map.removeLayer(layer);
                    }
                }
            });
        },
        addPoint: function (e) {
            if (!map) {
                console.error('Map is not initialized');
                return;
            }
            const marker = L.marker(e.latlng).addTo(map);
            measurePoints.push(e.latlng);
            if (measurePoints.length > 1) {
                const line = L.polyline([measurePoints[measurePoints.length - 2], e.latlng], {color: '#f357a1'}).addTo(map);
                const distance = e.latlng.distanceTo(measurePoints[measurePoints.length - 2]);
                L.tooltip({permanent: true, direction: 'center', className: 'measure-label'})
                    .setContent(formatDistance(distance))
                    .setLatLng(L.latLng(
                        (e.latlng.lat + measurePoints[measurePoints.length - 2].lat) / 2,
                        (e.latlng.lng + measurePoints[measurePoints.length - 2].lng) / 2
                    ))
                    .addTo(map);
            }
        },
        updateTempLine: function (e) {
            if (measurePoints.length > 0) {
                if (tempLine) {
                    map.removeLayer(tempLine);
                }
                if (tempLabel) {
                    map.removeLayer(tempLabel);
                }
                const lastPoint = measurePoints[measurePoints.length - 1];
                tempLine = L.polyline([lastPoint, e.latlng], {color: '#f357a1', dashArray: '5, 5'}).addTo(map);
                const distance = e.latlng.distanceTo(lastPoint);
                tempLabel = L.tooltip({permanent: true, direction: 'center', className: 'measure-label temp-label'})
                    .setContent(formatDistance(distance))
                    .setLatLng(L.latLng(
                        (e.latlng.lat + lastPoint.lat) / 2,
                        (e.latlng.lng + lastPoint.lng) / 2
                    ))
                    .addTo(map);
            }
        }
    });

    measureControl = new MeasureControl();
    if (map) {
        map.addControl(measureControl);
    } else {
        console.error('Map is not initialized');
    }
}

function calculateTotalDistance(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += points[i].distanceTo(points[i - 1]);
    }
    return total;
}

function formatDistance(distance) {
    if (distance >= 1000) {
        return (distance / 1000).toFixed(2) + ' km';
    } else {
        return Math.round(distance) + ' m';
    }
}

function initializeMap() {
    if (map) {
        map.invalidateSize(); // 이미 초기화된 경우 크기만 다시 계산
        return;
    }

    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded');
        return;
    }

    // 맵 초기화
    map = L.map('map').setView([36.5, 127.7], 8);

    // 타일 이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 줌 레벨 표시 컨트롤 생성
    const zoomControl = L.control({ position: 'bottomleft' });
    zoomControl.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'zoom-control');
        this._div.style.marginBottom = '5px'; // 하단 여백 추가
        this._div.style.marginLeft = '5px'; // 좌측 여백 추가
        this.update();
        return this._div;
    };
    zoomControl.update = function () {
        const zoom = map.getZoom();
        this._div.innerHTML = `Zoom Level: ${zoom}`;
    };
    zoomControl.addTo(map);

    // 축척 컨트롤 추가
    L.control.scale({
        imperial: false,  // 미터법만 사용
        position: 'bottomleft',  // 왼쪽 하단으로 설정
        maxWidth: 100,  // 최대 너비 설정
    }).addTo(map);

    // 줌 변경 이벤트에 대한 리스너 추가
    map.on('zoomend', function() {
        zoomControl.update();
    });

    // 마커 클러스터 그룹 생성
    window.markers = L.markerClusterGroup({
        maxClusterRadius: 30,  // 클러스터로 합쳐지는 최대 픽셀 거리 설정 (기본값은 80)
        // 기타 옵션 설정 가능
    });

    // 직선 거리 측정 버튼 추가 (이전의 도로 거리 측정 버튼 위치)
    const directDistanceButton = L.control({position: 'topleft'});
    directDistanceButton.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<a href="#" title="직선 거리 측정" role="button" aria-label="직선 거리 측정" id="direct-distance-button"><span style="font-size: 18px;">📏</span></a>';
        return div;
    };
    directDistanceButton.addTo(map);

    // 도로 거리 측정 버튼 추가 (이전의 직선 거리 측정 버튼 위치)
    const roadDistanceButton = L.control({position: 'topleft'});
    roadDistanceButton.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<a href="#" title="도로 거리 측정" role="button" aria-label="도로 거리 측정" id="road-distance-button"><span style="font-size: 18px;">🚗</span></a>';
        return div;
    };
    roadDistanceButton.addTo(map);

    // 거리 측정 완료 버튼 추가 (도로 거리와 직선 거리 측정에 공통으로 사용)
    const distanceCompleteButton = L.control({position: 'topleft'});
    distanceCompleteButton.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<a href="#" title="거리 측정 완료" role="button" aria-label="거리 측정 완료" id="distance-complete-button" style="display:none;">완료</a>';
        return div;
    };
    distanceCompleteButton.addTo(map);

    // 버튼 클릭 이벤트 리스너 추가
    document.getElementById('direct-distance-button').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDirectDistance();
    });

    document.getElementById('road-distance-button').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleRoadDistance();
    });

    document.getElementById('distance-complete-button').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isDirectDistanceMode) {
            finishDirectDistance();
        } else if (isRoadDistanceMode) {
            calculateFinalRoute();
        }
    });

    // 키보드 이벤트 리스너 추가 (한 번만 등록되도록 수정)
    if (!isKeyboardListenerAdded) {
        document.addEventListener('keydown', handleKeyPress);
        isKeyboardListenerAdded = true;
    }

    // 지도  이벤트 리스너 추가
    map.on('click', onMapClick);

    // save_markers.js의 초기화 함수 호출
    if (typeof initSaveMarkers === 'function') {
        initSaveMarkers(map);
    } else {
        console.error('initSaveMarkers function not found');
    }

    // 주소 검색 기능 구현
    const startSearchButton = document.getElementById('start-search-button');
    const endSearchButton = document.getElementById('end-search-button');
    const startAddressInput = document.getElementById('start-address-input');
    const endAddressInput = document.getElementById('end-address-input');

    startSearchButton.addEventListener('click', function() {
        searchAddress(startAddressInput.value, 'start');
    });

    endSearchButton.addEventListener('click', function() {
        searchAddress(endAddressInput.value, 'end');
    });

    startAddressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAddress(startAddressInput.value, 'start');
        }
    });

    endAddressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAddress(endAddressInput.value, 'end');
        }
    });

    function searchAddress(address, type) {
        if (address) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        map.setView([lat, lon], 16);
                        addSearchMarker([lat, lon], address, type);
                        
                        // 출발지와 도착지가 모두 설정되었는지 확인
                        if (startMarker && endMarker) {
                            calculateRoute();
                        }
                    } else {
                        alert('주소를 찾을 수 없습니다.');
                    }
                })
                .catch(error => {
                    alert('주소 검색 중 오류가 발생했습니다.');
                });
        }
    }

    function addSearchMarker(latlng, address, type) {
        let marker;
        let icon;

        if (type === 'start') {
            icon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            if (startMarker) {
                map.removeLayer(startMarker);
            }
            if (startLabel) {
                map.removeLayer(startLabel);
            }
            marker = L.marker(latlng, {icon: icon});
            startMarker = marker;
        } else if (type === 'end') {
            icon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            if (endMarker) {
                map.removeLayer(endMarker);
            }
            if (endLabel) {
                map.removeLayer(endLabel);
            }
            marker = L.marker(latlng, {icon: icon});
            endMarker = marker;
        }

        marker.addTo(map);

        // 마커 위에 이름을 표시하는 레이블 추가
        let labelText = `${type === 'start' ? '출발지' : '도착지'}: ${address}`;
        let labelIcon = L.divIcon({
            className: 'marker-label',
            html: `<div>${labelText}</div>`,
            iconSize: null,  // 자동 크기 조정을 위해 null로 설정
            iconAnchor: [0, 0]  // 왼쪽 상단 모서리에 고정
        });

        let label = L.marker(latlng, {icon: labelIcon, zIndexOffset: 1000});
        label.addTo(map);

        // 레이블 저장
        if (type === 'start') {
            startLabel = label;
        } else {
            endLabel = label;
        }

        // 팝업 대신 툴팁 사용
        marker.bindTooltip(labelText, {
            permanent: false,
            direction: 'top'
        });
    }

    function calculateRoute() {
        if (startMarker && endMarker) {
            const waypoints = [
                startMarker.getLatLng(),
                endMarker.getLatLng()
            ];
            
            if (routingControl) {
                map.removeControl(routingControl);
            }

            routingControl = L.Routing.control({
                waypoints: waypoints,
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    suppressDemoServerWarning: true
                }),
                lineOptions: {
                    styles: [{color: 'blue', opacity: 0.6, weight: 4}]
                },
                show: false,
                addWaypoints: false,
                routeWhileDragging: false,
                fitSelectedRoutes: true,
                showAlternatives: false
            }).addTo(map);

            routingControl.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                const totalDistance = (summary.totalDistance / 1000).toFixed(2);
                const totalTime = Math.round(summary.totalTime / 60);
                const dokchaga = calculateDokchaga(parseFloat(totalDistance));

                // 시간을 시간과 분으로 변환
                const hours = Math.floor(totalTime / 60);
                const minutes = totalTime % 60;
                let timeString = '';
                if (hours > 0) {
                    timeString += `${hours}시간 `;
                }
                timeString += `${minutes}분`;

                // 결과 표시
                const resultHTML = `
                    <strong>총 거리:</strong> ${totalDistance} km<br>
                    <strong>예상 시간:</strong> ${timeString}<br>
                    <strong>독차가:</strong> ${dokchaga.toLocaleString()}원
                `;
                
                // 결과를 표시할 요소를 찾아 내용을 업이트합니다.
                const resultElement = document.getElementById('route-result');
                if (resultElement) {
                    resultElement.innerHTML = resultHTML;
                } else {
                    console.error('결과를 표시할 요소를 찾을 수 없습니다.');
                }
            });

            routingControl.on('routingerror', function(e) {
                alert('경로를 계산하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
            });
        }
    }

    map.on('unload', function() {
        resetAllMeasurements();
        map = null;
    });

    initializeMeasureControl();
}

// 키보드 이벤트 처리 함수
function handleKeyPress(e) {
    if (e.key === 'Escape') {
        resetAllMeasurements();
        showNotification('모든 측정과 검색 결과가 초기화되었습니다');
    } else if (e.key === 'Enter') {
        if (isDirectDistanceMode) {
            finishDirectDistance();
        } else if (isRoadDistanceMode) {
            calculateFinalRoute();
        }
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // 3초 후에 메시지가 사라집니다
}

function resetMeasure() {
    if (measureControl && typeof measureControl.disable === 'function') {
        measureControl.disable();
    }
    if (measureLayer) {
        measureLayer.clearLayers();
    }
    if (measureLabel) {
        map.removeLayer(measureLabel);
        measureLabel = null;
    }
    if (directDistanceTooltip) {
        map.removeLayer(directDistanceTooltip);
        directDistanceTooltip = null;
    }
    
    // 저장된 마커와 선 제거
    measureMarkers.forEach(marker => map.removeLayer(marker));
    measureLines.forEach(line => map.removeLayer(line));
    measureMarkers = [];
    measureLines = [];
    
    measurePoints = [];
    isDirectDistanceMode = false;
    map.off('click', onMapClickForDirectDistance);
    
    // 모든 측정 관련 레이어 제거
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.Tooltip) {
            if (layer.options.className === 'measure-label' || (layer._tooltip && layer._tooltip.options.className === 'measure-label')) {
                map.removeLayer(layer);
            }
        }
    });
}

function resetAllMeasurements() {
    resetMeasure();
    resetRoadDistance();
    resetSearchResults();
    
    // 직선 거리 모드 비활성화
    isDirectDistanceMode = false;
    if (measureControl && typeof measureControl.disable === 'function') {
        measureControl.disable();
    }
    
    // 맵 클릭 이벤트 리스너 제거
    map.off('click', onMapClickForDirectDistance);
}

function toggleDirectDistance() {
    if (isDirectDistanceMode) {
        finishDirectDistance();
    } else {
        isDirectDistanceMode = true;
        isRoadDistanceMode = false;
        measureControl.startMeasure();
        document.getElementById('distance-complete-button').style.display = 'block';
        startDirectDistanceMeasurement();
    }
}

function toggleRoadDistance() {
    isRoadDistanceMode = !isRoadDistanceMode;
    isDirectDistanceMode = false;
    if (isRoadDistanceMode) {
        startRoadDistanceMeasurement();
        document.getElementById('distance-complete-button').style.display = 'block';
    } else {
        resetRoadDistance();
        document.getElementById('distance-complete-button').style.display = 'none';
    }
}

function startRoadDistanceMeasurement() {
    map.on('click', onMapClick);
    createTooltip();
    map.on('mousemove', updateTooltipPosition);
    map.getContainer().style.cursor = 'crosshair';
}

function createTooltip() {
    if (roadDistanceTooltip) {
        map.removeLayer(roadDistanceTooltip);
    }
    roadDistanceTooltip = L.tooltip({
        permanent: true,
        direction: 'right',
        offset: L.point(10, 0),
        className: 'road-distance-tooltip'
    })
    .setContent('클릭하여 로 시작점을 선택하세요');
    
    // 지도의 중앙 좌표를 사용하여 툴팁 위치 설정
    const center = map.getCenter();
    if (center && center.lat && center.lng) {
        roadDistanceTooltip.setLatLng(center);
        roadDistanceTooltip.addTo(map);
    }
}

function updateTooltipPosition(e) {
    if (roadDistanceTooltip && e && e.latlng && e.latlng.lat && e.latlng.lng) {
        roadDistanceTooltip.setLatLng(e.latlng);
        let content = '클릭하여 경로 시작점을 선택하세요';
        if (roadMarkers.length === 1) {
            content = '클릭하여 경로 끝점을 선택하세요';
        } else if (roadMarkers.length >= 2) {
            content = '클릭하여 경유지를 추가하세요 (완료 버튼 혹은 엔터를 눌러 측정 종료)';
        }
        roadDistanceTooltip.setContent(content);
    }
}

function onMapClick(e) {
    if (!isRoadDistanceMode) return;

    const marker = L.marker(e.latlng).addTo(map);
    roadMarkers.push(marker);

    if (roadMarkers.length >= 2) {
        updateRoute();
    }
    
    updateTooltipPosition(e);
}

function updateRoute() {
    if (roadMarkers.length < 2) return;

    const waypoints = roadMarkers.map(marker => marker.getLatLng());
    
    if (routingControl) {
        routingControl.setWaypoints(waypoints);
    } else {
        createRoutingControl(waypoints);
    }
}

function createRoutingControl(waypoints) {
    if (routingControl) {
        map.removeControl(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: waypoints,
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            suppressDemoServerWarning: true
        }),
        lineOptions: {
            styles: [{color: 'blue', opacity: 0.6, weight: 4}]
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: false,
        showAlternatives: false
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        currentRoute = routes[0];
        displayRouteInfo(currentRoute);
    });
}

function displayRouteInfo(route) {
    const summary = route.summary;
    const totalDistance = (summary.totalDistance / 1000).toFixed(2);
    const totalMinutes = Math.round(summary.totalTime / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    let totalTimeString = '';
    if (totalHours > 0) {
        totalTimeString += `${totalHours}시간 `;
    }
    totalTimeString += `${remainingMinutes}분`;

    // 독차가 계산 (전역 함수 사용)
    const dokchaga = calculateDokchaga(parseFloat(totalDistance));

    // 기존 레이블 제거
    roadDistanceLabels.forEach(label => map.removeLayer(label));
    roadDistanceLabels = [];

    // 각 구간별 레이블 생성 및 추가
    const coordinates = route.coordinates;
    const waypointIndices = route.waypointIndices;
    
    for (let i = 0; i < waypointIndices.length - 1; i++) {
        const start = waypointIndices[i];
        const end = waypointIndices[i + 1];
        const segmentCoords = coordinates.slice(start, end + 1);
        const midpoint = segmentCoords[Math.floor(segmentCoords.length / 2)];
        
        const segmentDistance = calculateSegmentDistance(segmentCoords);
        const segmentTime = calculateSegmentTime(start, end, summary.totalTime, coordinates.length);
        
        const label = L.marker(midpoint, {
            icon: L.divIcon({
                className: 'road-distance-label',
                html: `<div>거리: ${segmentDistance.toFixed(2)} km<br>시간: ${formatTime(segmentTime)}</div>`,
                iconSize: [100, 40],
                iconAnchor: [50, 20]
            })
        }).addTo(map);
        
        roadDistanceLabels.push(label);
    }

    // 총 합계 레이블 추가
    const totalLabel = L.marker(coordinates[coordinates.length - 1], {
        icon: L.divIcon({
            className: 'road-distance-label total-label',
            html: `<div>총 거리: ${totalDistance} km<br>총 시간: ${totalTimeString}<br>독차가: ${dokchaga.toLocaleString()}원</div>`,
            iconSize: [150, 60],
            iconAnchor: [75, 60]
        })
    }).addTo(map);
    roadDistanceLabels.push(totalLabel);
}

function calculateSegmentDistance(coordinates) {
    let distance = 0;
    for (let i = 1; i < coordinates.length; i++) {
        distance += coordinates[i-1].distanceTo(coordinates[i]);
    }
    return distance / 1000; // Convert to kilometers
}

function calculateSegmentTime(start, end, totalTime, totalCoordinates) {
    const segmentLength = end - start;
    return (segmentLength / totalCoordinates) * totalTime;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    
    if (hours > 0) {
        return `${hours}시간 ${remainingMinutes}분`;
    } else {
        return `${remainingMinutes}분`;
    }
}

function calculateFinalRoute() {
    if (roadMarkers.length < 2) {
        alert('경로를 완성하려면 최소 2개의 지점이 필요합니다.');
        return;
    }

    // 최종 경로 계산 및 표시
    updateRoute();

    // 도로 거리 측정 모드 종료
    endRoadDistanceMode();
}

function finishDirectDistance() {
    measureControl.stopMeasure();
    isDirectDistanceMode = false;
    document.getElementById('distance-complete-button').style.display = 'none';
    endDirectDistanceMeasurement();
}

function endRoadDistanceMode() {
    isRoadDistanceMode = false;
    document.getElementById('distance-complete-button').style.display = 'none';
    map.off('click', onMapClick);
    map.off('mousemove', updateTooltipPosition);
    if (roadDistanceTooltip) {
        map.removeLayer(roadDistanceTooltip);
        roadDistanceTooltip = null;
    }
    map.getContainer().style.cursor = '';
}

function resetRoadDistance() {
    // 라우팅 컨트롤 제거
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // 마커 제거
    roadMarkers.forEach(marker => {
        if (marker) {
            map.removeLayer(marker);
        }
    });
    roadMarkers = [];

    // 도로 시간 박스(레이블) 제거
    roadDistanceLabels.forEach(label => {
        if (label) {
            map.removeLayer(label);
        }
    });
    roadDistanceLabels = [];

    // 경로 라인 제거
    if (routeLine) {
        map.removeLayer(routeLine);
        routeLine = null;
    }

    endRoadDistanceMode();

    // 모드 상태 리셋
    isRoadDistanceMode = false;
    isDirectDistanceMode = false;
}

function resetSearchResults() {
    // 출발지, 도착지 마커 제거
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }
    
    // 출발지, 도착지 레이블 제거
    if (startLabel) {
        map.removeLayer(startLabel);
        startLabel = null;
    }
    if (endLabel) {
        map.removeLayer(endLabel);
        endLabel = null;
    }

    // 경로 제거
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // 입력 필드 초기화
    document.getElementById('start-address-input').value = '';
    document.getElementById('end-address-input').value = '';

    // 결과 표시 숨기기
    const resultElement = document.getElementById('route-result');
    if (resultElement) {
        resultElement.innerHTML = '';
    }
}

function startDirectDistanceMeasurement() {
    map.on('click', onMapClickForDirectDistance);
    createDirectDistanceTooltip();
    map.on('mousemove', updateDirectDistanceTooltipPosition);
    map.getContainer().style.cursor = 'crosshair';
    measureControl.startMeasure();
}

function endDirectDistanceMeasurement() {
    map.off('click', onMapClickForDirectDistance);
    map.off('mousemove', updateDirectDistanceTooltipPosition);
    if (directDistanceTooltip) {
        map.removeLayer(directDistanceTooltip);
        directDistanceTooltip = null;
    }
    map.getContainer().style.cursor = '';
    measureControl.stopMeasure();
}

function createDirectDistanceTooltip() {
    if (directDistanceTooltip) {
        map.removeLayer(directDistanceTooltip);
    }
    directDistanceTooltip = L.tooltip({
        permanent: true,
        direction: 'right',
        offset: L.point(10, 0),
        className: 'direct-distance-tooltip'
    })
    .setContent('클릭하여 시작점을 선택하세요');
    
    const center = map.getCenter();
    if (center && center.lat && center.lng) {
        directDistanceTooltip.setLatLng(center);
        directDistanceTooltip.addTo(map);
    }
}

function updateDirectDistanceTooltipPosition(e) {
    if (directDistanceTooltip && e && e.latlng && e.latlng.lat && e.latlng.lng) {
        directDistanceTooltip.setLatLng(e.latlng);
        let content = '클릭하여 시작점을 선택하세요';
        if (measurePoints.length === 1) {
            content = '클릭하여 끝점을 선택하세요';
        } else if (measurePoints.length >= 2) {
            content = '클릭하여 새로운 점을 추가하세요 (완료 버튼 혹은 엔터를 눌러 측정 종료)';
        }
        directDistanceTooltip.setContent(content);
    }
}

function onMapClickForDirectDistance(e) {
    if (!map) {
        console.error('Map is not initialized');
        return;
    }
    const marker = L.marker(e.latlng).addTo(map);
    measureMarkers.push(marker);
    measurePoints.push(e.latlng);
    if (measurePoints.length > 1) {
        const line = L.polyline([measurePoints[measurePoints.length - 2], e.latlng], {color: '#f357a1'}).addTo(map);
        measureLines.push(line);
        const distance = e.latlng.distanceTo(measurePoints[measurePoints.length - 2]);
        totalDistance += distance;
        const label = L.tooltip({permanent: true, direction: 'center', className: 'measure-label'})
            .setContent(formatDistance(distance))
            .setLatLng(L.latLng(
                (e.latlng.lat + measurePoints[measurePoints.length - 2].lat) / 2,
                (e.latlng.lng + measurePoints[measurePoints.length - 2].lng) / 2
            ))
            .addTo(map);
        measureLines.push(label);
        updateTotalDistanceLabel(e.latlng);
    }
    updateDirectDistanceTooltipPosition(e);
}

function updateTotalDistanceLabel(latlng) {
    if (totalDistanceLabel) {
        map.removeLayer(totalDistanceLabel);
    }
    totalDistanceLabel = L.marker(latlng, {
        icon: L.divIcon({
            className: 'total-distance-label',
            html: '<div>총 거리: ' + formatDistance(totalDistance) + '</div>',
            iconSize: [100, 24],
            iconAnchor: [50, 24]
        })
    }).addTo(map);
    measureMarkers.push(totalDistanceLabel);
}

function formatDistance(distance) {
    if (distance >= 1000) {
        return (distance / 1000).toFixed(2) + ' km';
    } else {
        return Math.round(distance) + ' m';
    }
}

function resetMeasure() {
    if (measureControl && typeof measureControl.disable === 'function') {
        measureControl.disable();
    }
    if (measureLayer) {
        measureLayer.clearLayers();
    }
    if (measureLabel) {
        map.removeLayer(measureLabel);
        measureLabel = null;
    }
    if (directDistanceTooltip) {
        map.removeLayer(directDistanceTooltip);
        directDistanceTooltip = null;
    }
    if (totalDistanceLabel) {
        map.removeLayer(totalDistanceLabel);
        totalDistanceLabel = null;
    }
    
    // 저장된 마커와 선 제거
    measureMarkers.forEach(marker => map.removeLayer(marker));
    measureLines.forEach(line => map.removeLayer(line));
    measureMarkers = [];
    measureLines = [];
    
    measurePoints = [];
    totalDistance = 0;
    isDirectDistanceMode = false;
    map.off('click', onMapClickForDirectDistance);
    
    // 모든 측정 관련 레이어 제거
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.Tooltip) {
            if (layer.options.className === 'measure-label' || layer.options.className === 'total-distance-label' || (layer._tooltip && layer._tooltip.options.className === 'measure-label')) {
                map.removeLayer(layer);
            }
        }
    });
}

function resetAllMeasurements() {
    resetMeasure();
    resetRoadDistance();
    resetSearchResults();
    
    // 직선 거리 모드 비활성화
    isDirectDistanceMode = false;
    if (measureControl && typeof measureControl.disable === 'function') {
        measureControl.disable();
    }
    
    // 맵 클릭 이벤트 리스너 제거
    map.off('click', onMapClickForDirectDistance);
}

// 페이지 로드 완료 시 initMap 함수 실행
window.onload = function() {
    if (typeof L !== 'undefined' && typeof L.Routing !== 'undefined') {
        initializeMap();
    } else {
        console.error('Leaflet or Leaflet Routing Machine not loaded');
    }
};
