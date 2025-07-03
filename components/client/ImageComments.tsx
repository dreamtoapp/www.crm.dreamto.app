"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  parentId: string | null;
}

// Tree node type for nested comments
interface CommentTreeNode extends Comment {
  children: CommentTreeNode[];
}

interface ImageCommentsProps {
  imageId: string;
  comments: (Comment & { parentId: string | null })[];
  clientId: string;
  currentUserId: string;
  currentUserRole: string;
}

// Helper to build a tree from flat comments
function buildCommentTree(comments: Comment[]): CommentTreeNode[] {
  const map: Record<string, CommentTreeNode> = {};
  const roots: CommentTreeNode[] = [];
  comments.forEach((c) => {
    map[c.id] = { ...c, children: [] };
  });
  comments.forEach((c) => {
    if (c.parentId) {
      map[c.parentId]?.children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

export default function ImageComments({ 
  imageId, 
  comments, 
  clientId,
  currentUserId,
  currentUserRole
}: ImageCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyValue, setReplyValue] = useState('');
  const router = useRouter();

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>, parentId?: string | null) => {
    e.preventDefault();
    const content = parentId ? replyValue : newComment;
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/images/${imageId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId, authorId: currentUserId })
      });
      if (response.ok) {
        setNewComment('');
        setReplyValue('');
        setReplyTo(null);
        router.refresh();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      CLIENT: 'العميل',
      DESIGNER: 'المصمم',
      ADMIN: 'المشرف'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'bg-primary text-primary-foreground';
      case 'DESIGNER': return 'bg-accent text-accent-foreground';
      case 'ADMIN': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Recursive comment renderer
  function CommentNode({ comment, depth = 0 }: { comment: CommentTreeNode, depth?: number }) {
    // Alignment and bubble style by role
    const isClient = comment.author.role === 'CLIENT';
    const alignClass = isClient ? 'justify-end text-right' : 'justify-start text-left';
    let bubbleClass = '';
    let textClass = '';
    let borderClass = '';
    if (comment.author.role === 'CLIENT') {
      bubbleClass = 'bg-primary';
      textClass = 'text-white';
      borderClass = 'border-2 border-primary';
    } else if (comment.author.role === 'DESIGNER') {
      bubbleClass = 'bg-accent';
      textClass = 'text-gray-900';
      borderClass = 'border-2 border-accent';
    } else if (comment.author.role === 'ADMIN') {
      bubbleClass = 'bg-secondary';
      textClass = 'text-gray-900';
      borderClass = 'border-2 border-secondary';
    } else {
      bubbleClass = 'bg-gray-200';
      textClass = 'text-gray-900';
      borderClass = 'border-2 border-gray-300';
    }
    return (
      <div style={{ marginRight: depth * 24 }} className={`mb-2 flex ${alignClass}`}> 
        <div className={`flex gap-3 p-3 rounded-2xl shadow-lg max-w-[80%] ${bubbleClass} ${textClass} ${borderClass} relative`}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getRoleColor(comment.author.role)}`}>
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(comment.createdAt).toISOString().split('T')[0]}
              </span>
            </div>
            <p className="text-sm leading-relaxed break-words text-gray-800">
              {comment.content}
            </p>
            <div className="mt-1 flex gap-2">
              {/* Only show reply button if current user has a different role than the comment author */}
              {comment.author.role !== currentUserRole && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyTo(comment.id)}
                >
                  رد
                </Button>
              )}
            </div>
            {replyTo === comment.id && (
              <form onSubmit={e => handleSubmitComment(e, comment.id)} className="mt-2 flex gap-2">
                <textarea
                  value={replyValue}
                  onChange={e => setReplyValue(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={2}
                  className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !replyValue.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  إرسال
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                  إلغاء
                </Button>
              </form>
            )}
            {/* Render children recursively */}
            {comment.children.length > 0 && (
              <div className="mt-2 border-r-2 border-muted-foreground/20 pr-2">
                {comment.children.map(child => (
                  <CommentNode key={child.id} comment={child} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const commentTree: CommentTreeNode[] = buildCommentTree(comments);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          التعليقات والملاحظات
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form (root) */}
        <form onSubmit={e => handleSubmitComment(e, null)} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="أضف تعليقك أو ملاحظاتك هنا..."
            rows={3}
            className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              إرسال التعليق
            </Button>
          </div>
        </form>
        {/* Comments List (threaded) */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>لا توجد تعليقات بعد</p>
              <p className="text-sm">كن أول من يضيف تعليقاً</p>
            </div>
          ) : (
            commentTree.map((comment) => (
              <CommentNode key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 