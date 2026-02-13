import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';
import apiRequest from './apiRequest';
import { API_BASE_URL } from '../config';

// Glass Styles reused/consistent with TaskForm
const glassStyle = `
  background: rgba(25, 25, 35, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const FormContainer = styled(motion.div)`
  ${glassStyle}
  padding: 2rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  background: linear-gradient(to right, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.3);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const MultiSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
`;

const MemberAvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 60px;
`;

const Avatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ hasImage }) => hasImage ? 'transparent' : 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  border: 2px solid ${({ selected }) => selected ? '#4ade80' : 'rgba(255,255,255,0.2)'};
  box-shadow: ${({ selected }) => selected ? '0 0 15px rgba(74, 222, 128, 0.5)' : 'none'};
  transition: all 0.2s;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.1);
    border-color: rgba(255,255,255,0.5);
  }
`;

const MemberName = styled.span`
  font-size: 0.75rem;
  text-align: center;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const BoardForm = ({ onClose, onSave }) => {
    const [boardName, setBoardName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const result = await apiRequest(`${API_BASE_URL}profiles/`);
            if (result.success) {
                setAvailableMembers(result.data);
            }
        };
        fetchProfiles();
    }, []);

    const toggleMember = (member) => {
        const isSelected = selectedMembers.some(m => m.employeeId === member.employeeId);
        let newMembers;
        if (isSelected) {
            newMembers = selectedMembers.filter(m => m.employeeId !== member.employeeId);
        } else {
            newMembers = [...selectedMembers, {
                employeeId: member.employeeId,
                name: member.name,
                profileImage: member.profileImage
            }];
        }
        setSelectedMembers(newMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            boardName,
            boardColor: '#ffffff', // Default
            employeeId: localStorage.getItem('user_id') || 'ST-R-TL-001', // Fallback
            is_active: true,
            members: selectedMembers.map(m => m.employeeId)
        };

        const result = await apiRequest(`${API_BASE_URL}boards/`, 'POST', payload);
        if (result.success) {
            onSave(result.data);
            onClose();
        } else {
            alert('Failed to create board: ' + (result.error || 'Unknown error'));
        }
    };

    return (
        <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FormContainer initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                <FormTitle>Create New Board</FormTitle>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Board Name</Label>
                        <Input
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            placeholder="My Awesome Board"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Add Members</Label>
                        <MultiSelectContainer>
                            {availableMembers.map(member => {
                                const isSelected = selectedMembers.some(m => m.employeeId === member.employeeId);
                                return (
                                    <MemberAvatarWrapper key={member.employeeId} onClick={() => toggleMember(member)} title={member.name}>
                                        <Avatar selected={isSelected} hasImage={!!member.profileImage}>
                                            {member.profileImage ? (
                                                <img src={member.profileImage} alt={member.name} />
                                            ) : (
                                                member.name ? member.name[0] : 'U'
                                            )}
                                        </Avatar>
                                        <MemberName>{member.name ? member.name.split(' ')[0] : member.employeeId}</MemberName>
                                    </MemberAvatarWrapper>
                                );
                            })}
                        </MultiSelectContainer>
                    </FormGroup>

                    <SubmitButton type="submit">
                        <FaSave /> Create Board
                    </SubmitButton>
                </form>
            </FormContainer>
        </Overlay>
    );
};

export default BoardForm;
