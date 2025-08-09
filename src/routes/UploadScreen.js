import {useEffect, useState, useRef} from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";

import styles from "../styles/Container.module.css";

import FormHeader from '../components/FormHeader';
import FormUploadArea from '../components/FormUploadArea';
import FormTitle from '../components/FormTitle';
import FormLocationLink from '../components/FormLocationLink';
import FormComment from '../components/FormComment';
import FormTagSelector from '../components/FormTagSelector';
import FormUploadButton from "../components/FormUploadButton";

const supabaseUrl = 'https://xnmoilwerkagbwevalbf.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function UploadScreen() {
    const navigate = useNavigate();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const [tags, setTags] = useState(null);

    const fileInputRef = useRef(null);

    // 위치 정보 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLatitude(pos.coords.latitude);
                    setLongitude(pos.coords.longitude);
                },
                (err) => {
                    console.error("❌ 위치 정보 가져오기 실패:", err);
                    alert("위치 정보를 가져올 수 없습니다.");
                }
            );
        } else {
            alert("이 브라우저에서는 위치 정보 사용이 불가능합니다.");
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file); // 이미지 파일 저장
            setImagePreview(URL.createObjectURL(file)); // 이미지에 대한 미리보기 생성
        }
    };

    // 이미지 업로드를 로컬 컴퓨터 경로 말고 -> 업로드한 파일 자체를 supabase storage로 넘기고 이미지 URL return..
    // supabase storage 주소를 json에 담아서 백엔드로

    const handleUpload = async () => {
        if (!imageFile || !title || !comment) {
            alert('이미지, 제목, 내용을 모두 입력해주세요');
            return;
        }
        
        // Supabase에 이미지 업로드
        const fileName = `${Date.now()}_${imageFile.name}`;
        const {data, error} = await supabase.storage
            .from('catimg')
            .upload(`images/${fileName}`, imageFile);

        if (error) {
            console.log('Upload err: ', error.message);
            alert('이미지 업로드 실패!');
            return;
        }

        // 이미지 공개 URL을 얻자.
        const {data: publicUrlData} = supabase.storage
            .from('catimg')
            .getPublicUrl(`images/${fileName}`);
        const imageUrl = publicUrlData.publicUrl;

        console.log(`✅ 이미지 업로드 완료: `, imageUrl);

        // FastAPI 서버로 POST 요청
        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    image_url: imageUrl,
                    title,
                    comment: comment,
                    latitude,
                    longitude,
                    tags: ""
                }),
            });

            const result = await response.json();
            console.log('✅ FastAPI 저장 성공:', result);
            alert('게시물 업로드 성공!');
            navigate("/game");   
        } catch (err) {
            console.error('❌ FastAPI 전송 실패:', err);
            alert('서버 저장 실패!');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.cardContainer}>
                <FormHeader/> 
                <FormUploadArea
                    imagePreview={imagePreview}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                /> 
                <div className={styles.formSections}>
                    <FormTitle
                        title={title}
                        setTitle={setTitle}    
                    />
                    <FormLocationLink/>
                    <FormComment
                        comment={comment}
                        setComment={setComment}
                    />
                    <FormTagSelector/>
                </div>
                <FormUploadButton onUpload={handleUpload}/>
            </div> 
        </div>
    );
}

export default UploadScreen;