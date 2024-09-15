// 맵 생성 코드
const map = L.map('map').setView([36.5, 127.7], 8);

// Leaflet 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 줌 레벨 표시 컨트롤 추가
L.Control.ZoomDisplay = L.Control.extend({
    onAdd: function(map) {
        const zoomContainer = L.DomUtil.create('div', 'zoom-display'); // 줌 레벨을 표시할 div 생성
        zoomContainer.style.backgroundColor = 'white';
        zoomContainer.style.padding = '5px 10px';
        zoomContainer.style.borderRadius = '5px';
        zoomContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

        this._zoomContainer = zoomContainer; // 컨트롤의 줌 컨테이너 참조
        this._updateZoom(map); // 현재 줌 레벨로 초기화

        map.on('zoomend', () => this._updateZoom(map)); // 줌 이벤트 발생 시마다 줌 레벨 업데이트

        return zoomContainer; // 컨트롤 반환
    },

    onRemove: function(map) {
        map.off('zoomend', this._updateZoom); // 줌 이벤트 리스너 제거
    },

    _updateZoom: function(map) {
        this._zoomContainer.innerHTML = `Zoom Level: ${map.getZoom()}`; // 줌 레벨 업데이트
    }
});

// 줌 레벨 표시 컨트롤을 맵 왼쪽 아래에 추가
const zoomDisplay = new L.Control.ZoomDisplay({ position: 'bottomleft' });
map.addControl(zoomDisplay);
