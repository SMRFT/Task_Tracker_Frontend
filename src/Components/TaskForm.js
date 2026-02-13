import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes, FaSave, FaPaperclip, FaCommentAlt, FaCloudUploadAlt } from 'react-icons/fa';
import apiRequest from './apiRequest';
import { API_BASE_URL } from '../config';

// Glass Styles
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
  background: rgba(0, 0, 0, 0.6); // Darker backdrop
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
  max-width: 700px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const FormTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.8rem;
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

const inputStyle = `
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
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const Input = styled.input`
  ${inputStyle}
`;

const TextArea = styled.textarea`
  ${inputStyle}
  min-height: 120px;
  resize: vertical;
`;

const Select = styled.select`
  ${inputStyle}
  cursor: pointer;
  
  option {
    background: #1f2937; // Fallback for options since they don't support transparency well
    color: white;
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
  background: ${({ theme, hasImage }) => hasImage ? 'transparent' : 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)'};
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

const SectionHeader = styled.h3`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
`;

const FileUploadZone = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  background: rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.2);
    color: white;
  }
`;

const TaskForm = ({ onClose, onSave, taskToEdit = null, selectedBoardId }) => {
    const [formData, setFormData] = useState({
        cardName: '',
        description: '',
        columnId: 'TODO',
        startdate: '',
        enddate: '',
        members: [],
        attachments: [],
        comment: [] // Client side comments handling
    });

    const [availableMembers, setAvailableMembers] = useState([]);
    const [userRole, setUserRole] = useState('Employee');
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('role') || 'Employee';
        setUserRole(role);

        const fetchProfiles = async () => {
            if (['Admin', 'HOD', 'TL'].includes(role)) {
                const result = await apiRequest(`${API_BASE_URL}profiles/`);
                if (result.success) {
                    setAvailableMembers(result.data);
                }
            }
        };
        fetchProfiles();

        if (taskToEdit) {
            setFormData({
                cardName: taskToEdit.cardName,
                description: taskToEdit.description,
                columnId: taskToEdit.columnId,
                startdate: taskToEdit.startdate || '',
                enddate: taskToEdit.enddate || '',
                members: Array.isArray(taskToEdit.members) ? taskToEdit.members : [],
                attachments: Array.isArray(taskToEdit.attachments) ? taskToEdit.attachments : [],
                comment: Array.isArray(taskToEdit.comment) ? taskToEdit.comment : []
            });
        }
    }, [taskToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMember = (member) => {
        const isSelected = formData.members.some(m => m.employeeId === member.employeeId);
        let newMembers;
        if (isSelected) {
            newMembers = formData.members.filter(m => m.employeeId !== member.employeeId);
        } else {
            newMembers = [...formData.members, {
                employeeId: member.employeeId,
                name: member.name,
                profileImage: member.profileImage
            }];
        }
        setFormData({ ...formData, members: newMembers });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        // Convert to Base64 (simplistic approach for demo)
        const filePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        content: reader.result // Base64 string
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        const newAttachments = await Promise.all(filePromises);
        setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const commentObj = {
            text: newComment,
            user: localStorage.getItem('user_id') || 'Unknown',
            date: new Date().toISOString()
        };
        setFormData(prev => ({ ...prev, comment: [...prev.comment, commentObj] }));
        setNewComment('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = taskToEdit
            ? `${API_BASE_URL}cards/${taskToEdit.cardId}/`
            : `${API_BASE_URL}cards/`;
        const method = taskToEdit ? 'PUT' : 'POST';

        const payload = { ...formData };

        // Members to ID list
        if (Array.isArray(payload.members)) {
            payload.members = payload.members.map(m => m.employeeId);
        }

        if (!taskToEdit) {
            payload.boardId = selectedBoardId || 1;
            payload.boardName = 'Main Board'; // Should fetch board name or ID
            payload.employeeId = 'SYSTEM';
        }

        const result = await apiRequest(url, method, payload);

        if (result.success) {
            onSave(result.data);
            onClose();
        } else {
            alert('Failed to save card: ' + (result.error || 'Unknown error'));
        }
    };

    const canAssign = ['Admin', 'HOD', 'TL'].includes(userRole);

    return (
        <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FormContainer initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                <FormTitle>{taskToEdit ? 'Edit Task' : 'New Task'}</FormTitle>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Task Title</Label>
                        <Input name="cardName" value={formData.cardName} onChange={handleChange} required placeholder="Enter task title..." />
                    </FormGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <FormGroup>
                            <Label>Status</Label>
                            <Select name="columnId" value={formData.columnId} onChange={handleChange}>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="HOLD">On Hold</option>
                                <option value="REVIEW">Review</option>
                                {canAssign && <option value="DONE">Done</option>}
                            </Select>
                        </FormGroup>
                    </div>

                    <FormGroup>
                        <Label>Description</Label>
                        <TextArea name="description" value={formData.description} onChange={handleChange} placeholder="Task details..." />
                    </FormGroup>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <FormGroup>
                            <Label>Start Date</Label>
                            <Input type="date" name="startdate" value={formData.startdate} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Due Date</Label>
                            <Input type="date" name="enddate" value={formData.enddate} onChange={handleChange} />
                        </FormGroup>
                    </div>

                    {canAssign && (
                        <FormGroup>
                            <Label>Assign Members</Label>
                            <MultiSelectContainer>
                                {availableMembers.map(member => {
                                    const isSelected = Array.isArray(formData.members) && formData.members.some(m => m.employeeId === member.employeeId);
                                    return (
                                        <MemberAvatarWrapper key={member.employeeId} onClick={() => toggleMember(member)} title={member.name}>
                                            <Avatar selected={isSelected} hasImage={!!member.profileImage} theme={undefined}>
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
                    )}

                    {/* Attachments Section */}
                    <FormGroup>
                        <SectionHeader><FaPaperclip /> Attachments</SectionHeader>
                        <FileUploadZone onClick={() => document.getElementById('fileInput').click()}>
                            <FaCloudUploadAlt size={30} style={{ marginBottom: '10px' }} />
                            <div>Click to upload files</div>
                            <input id="fileInput" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                        </FileUploadZone>
                        <div style={{ marginTop: '1rem' }}>
                            {formData.attachments.map((file, i) => (
                                <div key={i} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', marginBottom: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                                    {file.name}
                                </div>
                            ))}
                        </div>
                    </FormGroup>

                    {/* Comments Section */}
                    <FormGroup>
                        <SectionHeader><FaCommentAlt /> Comments</SectionHeader>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem' }}>
                            {formData.comment.map((c, i) => (
                                <div key={i} style={{ marginBottom: '0.8rem', borderLeft: '3px solid #667eea', paddingLeft: '0.8rem' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.user} - {new Date(c.date).toLocaleDateString()}</div>
                                    <div>{c.text}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button
                                type="button"
                                onClick={handleAddComment}
                                style={{ background: '#4ade80', border: 'none', borderRadius: '8px', padding: '0 1rem', color: '#1f2937', fontWeight: 'bold' }}
                            >
                                Send
                            </button>
                        </div>
                    </FormGroup>

                    <SubmitButton type="submit">
                        <FaSave /> {taskToEdit ? 'Update Task' : 'Create Task'}
                    </SubmitButton>
                </form>
            </FormContainer>
        </Overlay>
    );
};

export default TaskForm;
