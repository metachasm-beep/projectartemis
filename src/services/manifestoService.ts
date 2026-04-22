import { turso } from '@/lib/turso';

export interface ManifestoSubmission {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reading_time?: string;
}

export const ManifestoService = {
  /**
   * 🏛️ INITIALIZE SANCTUARY REGISTRY:
   * Creates the blog_submissions and blog_likes tables if they don't exist.
   */
  initialize: async () => {
    try {
      // Create Submissions Table
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS blog_submissions (
          id TEXT PRIMARY KEY,
          author_id TEXT,
          author_name TEXT,
          title TEXT,
          content TEXT,
          image_url TEXT,
          status TEXT DEFAULT 'pending',
          created_at TEXT
        )
      `);

      // Create Likes Table
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS blog_likes (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          blog_id TEXT,
          created_at TEXT,
          UNIQUE(user_id, blog_id)
        )
      `);

      console.log("MANIFESTO_SERVICE: Registry initialized.");
      return true;
    } catch (err) {
      console.error("MANIFESTO_INIT_ERROR:", err);
      return false;
    }
  },

  /**
   * ❤️ SOCIAL RESONANCE PROTOCOL:
   * Handles likes/unlikes for manifestos.
   */
  toggleLike: async (blogId: string, userId: string) => {
    try {
      // Check if already liked
      const res = await turso.execute({
        sql: "SELECT id FROM blog_likes WHERE user_id = ? AND blog_id = ?",
        args: [userId, blogId]
      });

      if (res.rows.length > 0) {
        // Unlike
        await turso.execute({
          sql: "DELETE FROM blog_likes WHERE user_id = ? AND blog_id = ?",
          args: [userId, blogId]
        });
        return { liked: false };
      } else {
        // Like
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await turso.execute({
          sql: "INSERT INTO blog_likes (id, user_id, blog_id, created_at) VALUES (?, ?, ?, ?)",
          args: [id, userId, blogId, now]
        });
        return { liked: true };
      }
    } catch (err) {
      console.error("MANIFESTO_LIKE_ERROR:", err);
      throw err;
    }
  },

  getLikesCount: async (blogId: string): Promise<number> => {
    try {
      const res = await turso.execute({
        sql: "SELECT COUNT(*) as count FROM blog_likes WHERE blog_id = ?",
        args: [blogId]
      });
      return Number(res.rows[0].count);
    } catch (err) {
      console.error("MANIFESTO_LIKES_COUNT_ERROR:", err);
      return 0;
    }
  },

  checkUserLike: async (blogId: string, userId: string): Promise<boolean> => {
    try {
      const res = await turso.execute({
        sql: "SELECT id FROM blog_likes WHERE user_id = ? AND blog_id = ?",
        args: [userId, blogId]
      });
      return res.rows.length > 0;
    } catch (err) {
      return false;
    }
  },

  /**
   * 🖋️ SUBMIT MANIFESTO:
   * Records a new community submission for review.
   */
  submit: async (data: Omit<ManifestoSubmission, 'status' | 'created_at'>) => {
    try {
      // 🚀 Just-In-Time Registry Manifestation
      await ManifestoService.initialize();

      const now = new Date().toISOString();
      await turso.execute({
        sql: "INSERT INTO blog_submissions (id, author_id, author_name, title, content, image_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)",
        args: [data.id, data.author_id, data.author_name, data.title, data.content, data.image_url, now]
      });
      return true;
    } catch (err) {
      console.error("MANIFESTO_SUBMIT_ERROR:", err);
      return false;
    }
  },

  /**
   * 📖 FETCH LIVE FEED:
   * Retrieves all approved manifestos for the public Journal.
   */
  /**
   * 📖 FETCH LIVE FEED:
   * Retrieves all approved manifestos for the public Journal.
   * Includes JIT initialization if the registry is missing.
   */
  getLiveManifestos: async (): Promise<(ManifestoSubmission & { likes_count: number })[]> => {
    try {
      // 🚀 Just-In-Time Registry Manifestation
      await ManifestoService.initialize();
      
      const res = await turso.execute(`
        SELECT *, (SELECT COUNT(*) FROM blog_likes WHERE blog_id = blog_submissions.id) as likes_count 
        FROM blog_submissions 
        WHERE status = 'approved' 
        ORDER BY created_at DESC
      `);
      return res.rows as unknown as (ManifestoSubmission & { likes_count: number })[];
    } catch (err) {
      console.error("MANIFESTO_FETCH_ERROR:", err);
      return [];
    }
  },


  /**
   * 🛡️ FETCH PENDING QUEUE:
   * (Admin Only) Retrieves all manifestos waiting for review.
   */
  getPendingQueue: async (): Promise<ManifestoSubmission[]> => {
    try {
      const res = await turso.execute("SELECT * FROM blog_submissions WHERE status = 'pending' ORDER BY created_at DESC");
      return res.rows as unknown as ManifestoSubmission[];
    } catch (err) {
      console.error("MANIFESTO_ADMIN_FETCH_ERROR:", err);
      return [];
    }
  },

  /**
   * ⚖️ MODERATE MANIFESTO:
   * Approves or Rejects a submission.
   */
  moderate: async (id: string, status: 'approved' | 'rejected') => {
    try {
      await turso.execute({
        sql: "UPDATE blog_submissions SET status = ? WHERE id = ?",
        args: [status, id]
      });
      return true;
    } catch (err) {
      console.error("MANIFESTO_MODERATE_ERROR:", err);
      return false;
    }
  }
};
