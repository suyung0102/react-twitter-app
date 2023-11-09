import { styled } from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: blue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const EditConfirmButton = styled.button`
  background-color: gray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const EditTextFiled = styled.textarea`
  margin: 10px 0;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [edit, setEdit] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const onDelete = async () => {
    const ok = confirm('트윗을 삭제하시겠습니까?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onModeChange = () => {
    if (edit) {
      setNewTweet(tweet);
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onEdit = async () => {
    try {
      await updateDoc(doc(db, 'tweets', id), {
        tweet: newTweet,
      });
    } catch (error) {
      console.error(error);
    } finally {
      onModeChange();
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {edit ? (
          <EditTextFiled rows={5} maxLength={180} onChange={onChange} value={newTweet}></EditTextFiled>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? <DeleteButton onClick={onDelete}>삭제</DeleteButton> : null}
        {user?.uid === userId ? <EditButton onClick={onModeChange}>{edit ? '수정중...' : '수정'}</EditButton> : null}
        {user?.uid === userId && edit ? <EditConfirmButton onClick={onEdit}>수정완료</EditConfirmButton> : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
