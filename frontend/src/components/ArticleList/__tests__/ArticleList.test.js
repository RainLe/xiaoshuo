import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleList from '../ArticleList';

describe('ArticleList', () => {
  it('renders articles', () => {
    const items = [
      { id: 1, title: 'Test Title', category: { name: '小说' }, pub_date: '2025-08-16T12:00:00', summary: '摘要内容' },
      { id: 2, title: 'Another', category: null, pub_date: '2025-08-15T10:00:00', summary: 'Another summary' },
    ];
    render(<ArticleList items={items} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('栏目：小说')).toBeInTheDocument();
    expect(screen.getByText('栏目：无')).toBeInTheDocument();
    expect(screen.getByText('摘要内容')).toBeInTheDocument();
    expect(screen.getByText('Another summary')).toBeInTheDocument();
  });
});
