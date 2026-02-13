import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSpinner, FaEdit, FaTrash, FaUserTie, FaUser, FaLayerGroup, FaPauseCircle } from 'react-icons/fa';
import apiRequest from './apiRequest';
import { API_BASE_URL } from '../config';
import TaskForm from './TaskForm';
import BoardForm from './BoardForm';

const glassStyle = `
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  color: white; 
`;

const Sidebar = styled.div`
  width: 260px;
  ${glassStyle}
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: none; 
  }
`;

const SidebarTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const BoardItem = styled.div`
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ active }) => active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const AddBoardButton = styled.button`
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(to right, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

const BoardContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  height: 100%;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
`;

const Column = styled.div`
  ${glassStyle}
  min-width: 320px;
  max-width: 350px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: 100%;
  background: rgba(20, 20, 30, 0.4); 

  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
    max-height: none;
  }
`;

const ColumnHeader = styled.div`
  padding: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const CardList = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
`;

const Card = styled(motion.div)`
  ${glassStyle}
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const CardDesc = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MemberIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #556270 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.3);
  margin-left: -8px;
  
  &:first-child {
    margin-left: 0;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: white;
`;

const COLUMNS = [
  { id: 'TODO', title: 'To Do', icon: <FaUserTie /> },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: <FaUser /> },
  { id: 'HOLD', title: 'On Hold', icon: <FaPauseCircle /> },
  { id: 'REVIEW', title: 'Review', icon: <FaUserTie /> },
  { id: 'DONE', title: 'Done', icon: <FaUser /> },
];

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  // Helper to fetch data
  const fetchData = async () => {
    setLoading(true);

    try {
      const [cardsResult, boardsResult] = await Promise.all([
        apiRequest(`${API_BASE_URL}cards/`),
        apiRequest(`${API_BASE_URL}boards/`)
      ]);

      if (cardsResult.success) {
        setCards(cardsResult.data);
      }

      if (boardsResult.success && boardsResult.data.length > 0) {
        setBoards(boardsResult.data);
        if (!selectedBoardId || !boardsResult.data.find(b => b.boardId === selectedBoardId)) {
          setSelectedBoardId(boardsResult.data[0].boardId);
        }
      } else {
        // If no boards, maybe user needs to create one. 
        // We can also automate creating a "Default Board" here if needed,
        // but let's leave it empty so they see "Workspaces" and "New Board".
        // Or create a default one to avoid empty state issues.
        if (boardsResult.success && boardsResult.data.length === 0) {
          const defaultBoard = {
            boardName: 'Main Board',
            boardColor: '#ffffff',
            employeeId: 'SYSTEM',
            is_active: true,
            members: []
          };
          const createResult = await apiRequest(`${API_BASE_URL}boards/`, 'POST', defaultBoard);
          if (createResult.success) {
            setBoards([createResult.data]);
            setSelectedBoardId(createResult.data.boardId);
          }
        }
      }
    } catch (error) {
      console.error("Error creating dashboard data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (card) => {
    setCurrentCard(card);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setCurrentCard(null);
    setIsFormOpen(true);
  };

  const handleCreateBoard = () => {
    setIsBoardFormOpen(true);
  };

  const handleSave = (savedCard) => {
    // Re-fetch to ensure consistency or optimistically update
    fetchData();
  };

  const handleBoardSaved = (newBoard) => {
    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.boardId);
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <FaSpinner />
        </motion.div>
      </LoadingWrapper>
    );
  }

  // Filter cards by selected board
  const filteredCards = cards.filter(c => c.boardId === selectedBoardId || !c.boardId);

  return (
    <Container>
      <Sidebar>
        <SidebarTitle><FaLayerGroup /> Workspaces</SidebarTitle>
        {boards.map(board => (
          <BoardItem
            key={board.boardId}
            active={selectedBoardId === board.boardId}
            onClick={() => setSelectedBoardId(board.boardId)}
          >
            <span>{board.boardName}</span>
          </BoardItem>
        ))}
        <AddBoardButton onClick={handleCreateBoard}>
          <FaPlus /> New Board
        </AddBoardButton>
      </Sidebar>

      <MainContent>
        <Header>
          {/* Show Board Name */}
          <Title>{boards.find(b => b.boardId === selectedBoardId)?.boardName || 'Task Board'}</Title>
          <CreateButton onClick={handleCreate}><FaPlus /> New Task</CreateButton>
        </Header>

        <BoardContainer>
          {COLUMNS.map(col => (
            <Column key={col.id}>
              <ColumnHeader>
                <ColumnTitle>{col.icon} {col.title}</ColumnTitle>
                <Badge>{filteredCards.filter(c => c.columnId === col.id).length}</Badge>
              </ColumnHeader>
              <CardList>
                <AnimatePresence>
                  {filteredCards.filter(c => c.columnId === col.id).map(card => (
                    <Card
                      key={card.cardId}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => handleEdit(card)}
                    >
                      <CardTitle>{card.cardName}</CardTitle>
                      <CardDesc>{card.description}</CardDesc>
                      <CardMeta>
                        <span>#{card.cardId}</span>
                        <div style={{ display: 'flex' }}>
                          {Array.isArray(card.members) && card.members.map((m, i) => (
                            <MemberIcon key={i} title={m.name || m.employeeId}>
                              {m.profileImage ? (
                                <img src={m.profileImage} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                (m.name ? m.name[0] : 'U')
                              )}
                            </MemberIcon>
                          ))}
                        </div>
                      </CardMeta>
                    </Card>
                  ))}
                </AnimatePresence>
              </CardList>
            </Column>
          ))}
        </BoardContainer>
      </MainContent>

      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            onClose={() => setIsFormOpen(false)}
            onSave={handleSave}
            taskToEdit={currentCard}
            selectedBoardId={selectedBoardId}
          />
        )}
        {isBoardFormOpen && (
          <BoardForm
            onClose={() => setIsBoardFormOpen(false)}
            onSave={handleBoardSaved}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Dashboard;
