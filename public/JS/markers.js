// 마커 클러스터 그룹 생성
const markers = L.markerClusterGroup({
    maxClusterRadius: 30,  // 클러스터로 합쳐지는 최대 픽셀 거리 설정 (기본값은 80)
    // 기타 옵션 설정 가능
});

// OSM 타일 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const createCustomIcon = (colorClass) => {
    const iconSize = 25;  // 아이콘 본체의 크기
    const tailWidth = 10;  // 꼬리의 너비
    const tailHeight = 10;  // 꼬리의 높이
    const iconColor = {
        'icon-blue': '#3859da',
        'icon-red': '#fe7575',
        'icon-orange': 'orange',
        'icon-white': 'white',
        'icon-gray': 'gray',
        'icon-skyblue' : '#b3d8fd',
        'icon-brown' : '#81654a',
        'icon-white' : '#f4f4f4',
        'icon-skybrown' : '#fedcfe',
    };

    // 아이콘과 꼬리를 포함한 SVG 생성
    const iconHtml = `
        <svg width="${iconSize}" height="${iconSize + tailHeight}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
            <!-- 원형 상단 -->
            <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2 - 2}" fill="${iconColor[colorClass] || 'white'}" stroke="white" stroke-width="2"/>
            <!-- 숫자 1 추가 -->
            <text x="${iconSize / 2.01}" y="${iconSize / 2 + 4}" text-anchor="middle" font-size="12" fill="black" font-weight="bold">1</text>
            <!-- 삼각형 꼬리 -->
            <path d="
                M ${iconSize / 2 - tailWidth / 2},${iconSize}
                L ${iconSize / 2 + tailWidth / 2},${iconSize}
                L ${iconSize / 2},${iconSize + tailHeight}
                Z
            " fill="${iconColor[colorClass] || 'white'}" stroke="white" stroke-width="2"/>
        </svg>
    `;

    return L.divIcon({
        className: '',  // CSS 클래스를 사용하지 않음
        html: iconHtml,  // 직접 생성한 HTML 사용
        iconSize: [iconSize, iconSize + tailHeight],  // 아이콘 크기 설정 (꼬리 포함)
        iconAnchor: [iconSize / 2, iconSize + tailHeight],  // 아이콘 앵커 포인트 (꼬리 끝)
        popupAnchor: [0, -iconSize / 2]  // 팝업 앵커 포인트 (아이콘 바로 위)
    });
};

// 서비스 타입에 따른 아이콘 색상 설정
const serviceTypeIcons = {
    1: createCustomIcon('icon-blue'),  // 1톤팀 - 파란색
    2: createCustomIcon('icon-red'),   // 익스프레스 - 빨간색
    3: createCustomIcon('icon-orange'),  // 당근 - 주황색
    4: createCustomIcon('icon-white'),   // 청소 - 흰색
    5: createCustomIcon('icon-skyblue'),   // 에어컨 - 하늘색
    6: createCustomIcon('icon-brown'),   // 창고 - 갈색
    7: createCustomIcon('icon-white'),   // 파출부 - 흰색
    8: createCustomIcon('icon-skybrown')   // 인테리어 - 연갈
};
