function initSaveMarkers(map) {
    let currentPopup = null; // 현재 열려 있는 팝업을 추적하는 변수

    // 우클릭 이벤트 리스너 추가
    map.on('contextmenu', function (e) {
        const { lat, lng } = e.latlng;

        // 기존에 열린 팝업이 있으면 닫기
        if (currentPopup) {
            document.body.removeChild(currentPopup);
            currentPopup = null;
        }

        // 팝업 컨테이너 생성
        const container = document.createElement('div');
        container.id = 'custom-popup';
        container.style.position = 'absolute';
        container.style.backgroundColor = 'white';
        container.style.padding = '20px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
        container.style.width = '250px';  // 창 너비를 넓게 설정
        container.style.zIndex = 1000;

        // 닫기 버튼 생성
        const closeButton = document.createElement('button');
        closeButton.id = 'close-button';
        closeButton.innerHTML = '&#10005;';  // X 표시
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '18px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.color = 'black';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function () {
            if (currentPopup) {
                document.body.removeChild(currentPopup);  // 팝업 제거
                currentPopup = null;
            }
        };

        container.appendChild(closeButton);  // 닫기 버튼을 팝업에 추가

        // 제목 생성
        const title = document.createElement('h2');
        title.textContent = '신규 팀 추가';
        title.style.textAlign = 'left';
        title.style.margin = '0 0 10px 0';  // 제목과 입력 필드 사이에 간격 추가

        container.appendChild(title);  // 제목을 팝업에 추가

        // 입력 필드와 버튼 추가
        const formContainer = document.createElement('div');
        formContainer.style.marginTop = '20px';
        formContainer.style.display = 'flex';
        formContainer.style.flexDirection = 'column';
        formContainer.style.gap = '10px';

        // 서비스 타입 선택 그룹
        const serviceTypeGroup = document.createElement('div');
        serviceTypeGroup.className = 'input-group';
        serviceTypeGroup.style.display = 'flex';  // Flexbox 사용
        serviceTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        serviceTypeGroup.innerHTML = `
            <label style="min-width: 100px;">서비스 타입 :</label>
            <select id="serviceType" style="width: 150px;">
                <option value="1" selected>1톤팀</option>
                <option value="2">익스프레스</option>
                <option value="3">당근</option>
                <option value="4">청소</option>
                <option value="5">에어컨</option>
                <option value="6">창고</option>
                <option value="7">파출부</option>
                <option value="8">인테리어</option>
                <option value="9">기타</option>
            </select>
        `;
        formContainer.appendChild(serviceTypeGroup);

        // 이름 입력 그룹
        const nameGroup = document.createElement('div');
        nameGroup.className = 'input-group';
        nameGroup.style.display = 'flex';  // Flexbox 사용
        nameGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        nameGroup.innerHTML = '<label style="min-width: 100px;">이름 :</label><input type="text" id="name" style="width: 150px;"/>';
        formContainer.appendChild(nameGroup);

        // 차량 번호 입력 그룹
        const vehicleNumberGroup = document.createElement('div');
        vehicleNumberGroup.className = 'input-group';
        vehicleNumberGroup.style.display = 'flex';  // Flexbox 사용
        vehicleNumberGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        vehicleNumberGroup.innerHTML = '<label style="min-width: 100px;">차량 번호 :</label><input type="text" id="vehicleNumber" style="width: 150px;" />';
        formContainer.appendChild(vehicleNumberGroup);

        // 전화 번호 입력 그룹
        const phoneNumberGroup = document.createElement('div');
        phoneNumberGroup.className = 'input-group';
        phoneNumberGroup.style.display = 'flex';  // Flexbox 사용
        phoneNumberGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        phoneNumberGroup.innerHTML = '<label style="min-width: 100px;">전화 번호 :</label><input type="text" id="phoneNumber" style="width: 150px;" maxlength="13" />';
        formContainer.appendChild(phoneNumberGroup);

        // 전화 번호 입력 필드에 이벤트 리스너 추가
        const phoneNumberInput = phoneNumberGroup.querySelector('#phoneNumber');
        phoneNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거

            if (value.length > 11) {
                value = value.slice(0, 11); // 최대 11자리까지만 허용
            }

            if (value.length > 10) {
                value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (value.length > 8) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
            } else if (value.length > 4) {
                value = value.replace(/(\d{4})(\d{1,4})/, '$1-$2');
            }

            e.target.value = value;
        });
        
        // 지역 이름 입력 그룹
        const locationGroup = document.createElement('div');
        locationGroup.className = 'input-group';
        locationGroup.style.display = 'flex';  // Flexbox 사용
        locationGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        locationGroup.innerHTML = '<label style="min-width: 100px;">지역 이름 :</label><input type="text" id="location" style="width: 150px;"/>';
        formContainer.appendChild(locationGroup);

        // 차량 톤수 및 차량 종류 입력 그룹 (가로로 배치)
        const vehicleTonnageTypeGroup = document.createElement('div');
        vehicleTonnageTypeGroup.className = 'input-group';
        vehicleTonnageTypeGroup.style.display = 'flex';  // Flexbox 사용
        vehicleTonnageTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        vehicleTonnageTypeGroup.style.display = 'none';  // 초기에는 숨김 처리

        // 라벨 생성
        const vehicleTonnageTypeLabel = document.createElement('label');
        vehicleTonnageTypeLabel.style.minWidth = '100px';
        vehicleTonnageTypeLabel.textContent = '차량 톤수 :';
        vehicleTonnageTypeGroup.appendChild(vehicleTonnageTypeLabel);

        // 입력 필드들을 담을 컨테이너 생성
        const vehicleTonnageTypeInputs = document.createElement('div');
        vehicleTonnageTypeInputs.style.display = 'flex';
        vehicleTonnageTypeInputs.style.alignItems = 'center';
        vehicleTonnageTypeInputs.style.gap = '5px';

        // 차량 톤수 입력 부분
        const vehicleTonnageInput = document.createElement('input');
        vehicleTonnageInput.type = 'number';
        vehicleTonnageInput.id = 'vehicleTonnage';
        vehicleTonnageInput.style.width = '50px';
        vehicleTonnageTypeInputs.appendChild(vehicleTonnageInput);

        const tonLabel = document.createElement('span');
        tonLabel.textContent = '톤';
        vehicleTonnageTypeInputs.appendChild(tonLabel);

        // 차량 종류 선택 부분
        const vehicleTypeSelect = document.createElement('select');
        vehicleTypeSelect.id = 'vehicleType';
        vehicleTypeSelect.style.width = '74px';
        vehicleTypeSelect.innerHTML = `
            <option value="1" selected>카고</option>
            <option value="2">호루</option>
            <option value="3">탑차</option>
            <option value="4">윙바디</option>
            <option value="5">리프트카</option>
            <option value="6">냉동탑</option>
            <option value="7">냉동윙</option>
            <option value="8">전기차</option>
            <option value="9">전기리프트</option>
            <option value="10">다마스</option>
            <option value="11">라보</option>
        `;
        vehicleTonnageTypeInputs.appendChild(vehicleTypeSelect);

        // 입력 필드 컨테이너를 그룹에 추가
        vehicleTonnageTypeGroup.appendChild(vehicleTonnageTypeInputs);

        formContainer.appendChild(vehicleTonnageTypeGroup);

        // 이사 종류 선택 그룹
        const movingTypeGroup = document.createElement('div');
        movingTypeGroup.className = 'input-group';
        movingTypeGroup.style.display = 'flex';  // Flexbox 사용
        movingTypeGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        movingTypeGroup.innerHTML = `
            <label style="min-width: 100px;">이사 종류 :</label>
            <select id="movingType" style="width: 150px;">
                <option value="1" selected>포장이사</option>
                <option value="2">반포장이사</option>
                <option value="3">일반이사</option>
                <option value="4">익스프레스</option>
                <option value="5">단순용달</option>
            </select>
        `;
        formContainer.appendChild(movingTypeGroup);

        // 충성도 입력 그룹
        const loyaltyGroup = document.createElement('div');
        loyaltyGroup.className = 'input-group';
        loyaltyGroup.style.display = 'flex';  // Flexbox 사용
        loyaltyGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        loyaltyGroup.innerHTML = `
            <label style="min-width: 100px;">충성도 :</label>
            <input type="number" id="loyalty" style="width: 60px;" />
            <span style="margin-left: 5px;">(1~10)</span> <!-- 설명 텍스트 추가 -->
        `;
        formContainer.appendChild(loyaltyGroup);

        // 친절도 입력 그룹
        const friendlinessGroup = document.createElement('div');
        friendlinessGroup.className = 'input-group';
        friendlinessGroup.style.display = 'flex';  // Flexbox 사용
        friendlinessGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        friendlinessGroup.innerHTML = `
            <label style="min-width: 100px;">친절도 :</label>
            <input type="number" id="friendliness" style="width: 60px;" />
            <span style="margin-left: 5px;">(1~10)</span> <!-- 설명 텍스트 추가 -->
        `;
        formContainer.appendChild(friendlinessGroup);

        // 배차 횟수 입력 그룹
        const dispatchCountGroup = document.createElement('div');
        dispatchCountGroup.className = 'input-group';
        dispatchCountGroup.style.display = 'flex';  // Flexbox 사용
        dispatchCountGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        dispatchCountGroup.innerHTML = '<label style="min-width: 100px;">배차 횟수 :</label><input type="number" id="dispatchCount" style="width: 150px;" />';
        formContainer.appendChild(dispatchCountGroup);

        // 추가 메모 입력 그룹
        const additionalNotesGroup = document.createElement('div');
        additionalNotesGroup.className = 'input-group';
        additionalNotesGroup.style.display = 'flex';  // Flexbox 사용
        additionalNotesGroup.style.alignItems = 'center';  // 수직 가운데 정렬
        additionalNotesGroup.innerHTML = '<label style="min-width: 100px;">추가 메모 :</label><textarea id="additionalNotes" style="flex: 1; height: 80px; resize: vertical;"></textarea>';
        formContainer.appendChild(additionalNotesGroup);

        // 서비스 타입 선택에 따른 필드 표시/숨기기
        const serviceTypeSelect = serviceTypeGroup.querySelector('#serviceType');
        serviceTypeSelect.addEventListener('change', function () {
            const selectedValue = this.value;
            const shouldDisplay = selectedValue === '1';  // 1톤팀일 때만 표시

            vehicleNumberGroup.style.display = shouldDisplay ? 'flex' : 'none';
            vehicleTonnageTypeGroup.style.display = shouldDisplay ? 'flex' : 'none';
            movingTypeGroup.style.display = shouldDisplay ? 'flex' : 'none';
        });

        // 초기 상태에 따라 필드 표시/숨기기
        serviceTypeSelect.dispatchEvent(new Event('change'));

        // 추가 버튼 생성
        const addButton = document.createElement('button');
        addButton.textContent = '추가';
        addButton.onclick = function () {
            addVehicle(lat, lng);  // 차량 추가 함수 호출
        };
        formContainer.appendChild(addButton);

        container.appendChild(formContainer);  // 폼을 팝업에 추가
        document.body.appendChild(container);  // 팝업을 문서에 추가

        // 팝업 위치 계산
        const { clientX: mouseX, clientY: mouseY } = e.originalEvent;  // 마우스 클릭 위치
        const popupWidth = container.offsetWidth;
        const popupHeight = container.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 팝업 위치 설정 (화면 밖으로 나갈 경우 조정)
        let top = mouseY + 10;
        let left = mouseX + 10;
        if (mouseX + popupWidth + 20 > windowWidth) {
            left = windowWidth - popupWidth - 20;
        }
        if (mouseY + popupHeight + 20 > windowHeight) {
            top = windowHeight - popupHeight - 20;
        }

        container.style.top = `${top}px`;
        container.style.left = `${left}px`;

        currentPopup = container;  // 현재 팝업 추적
    });

    // addVehicle 함수도 이 스코프 내에 위치시킵니다.
    async function addVehicle(latitude, longitude) {
        // 비밀번호 입력 프롬프트
        const password = prompt("비밀번호를 입력하세요:");
        if (password !== "24대학%") {
            alert("비밀번호가 올바르지 않습니다.");
            return;
        }

        const name = document.getElementById('name').value;
        const vehicleNumber = document.getElementById('vehicleNumber') ? document.getElementById('vehicleNumber').value : '';  // 차량 번호 값이 없으면 빈 문자열로 설정
        const phoneNumber = document.getElementById('phoneNumber').value;
        const location = document.getElementById('location').value;
        const vehicleTonnage = parseFloat(document.getElementById('vehicleTonnage').value);
        const vehicleType = document.getElementById('vehicleType') ? parseInt(document.getElementById('vehicleType').value) : null;  // 차량 종류 값이 없으면 null로 설정
        const movingType = document.getElementById('movingType') ? parseInt(document.getElementById('movingType').value) : null;  // 이사 종류 값이 없으면 null로 설정
        const serviceType = parseInt(document.getElementById('serviceType').value);  // 서비스 타입 값 가져오기
        const loyalty = parseInt(document.getElementById('loyalty').value);
        const friendliness = parseInt(document.getElementById('friendliness').value);
        const dispatchCount = parseInt(document.getElementById('dispatchCount').value);
        const additionalNotes = document.getElementById('additionalNotes').value;

        // 데이터 유효성 검사
        if (!name || !phoneNumber || !serviceType) {
            alert('데이터를 모두 입력해주세요!');
            return;
        }

        // 충성도와 친절도가 0에서 10 사이인지 확인
        if (loyalty < 0 || loyalty > 10) {
            alert('충성도는 0에서 10 사이의 값을 입력해야 합니다.');
            return;
        }

        if (friendliness < 0 || friendliness > 10) {
            alert('친절도는 0에서 10 사이의 값을 입력해야 합니다.');
            return;
        }

        const newVehicle = {
            name,
            vehicleNumber,
            phoneNumber,
            location,
            vehicleTonnage,
            vehicleType,
            movingType,
            serviceType, // 추가된 서비스 타입
            loyalty,
            friendliness,
            dispatchCount,
            additionalNotes,
            latitude,
            longitude
        };

        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVehicle)
        });

        const result = await response.json();
        if (response.ok) {
            alert('기사 추가 완료!');
            loadVehicleData();  // 새로운 데이터를 불러와서 지도에 표시
            document.body.removeChild(currentPopup);  // 입력 창 닫기
            currentPopup = null;
        } else {
            console.error('추가 실패:', result.error);
            alert(`기사 추가 실패: ${result.error}`);
        }
    }

    // addVehicle 함수를 전역 스코프에서 접근 가능하게 만듭니다.
    window.addVehicle = addVehicle;
}