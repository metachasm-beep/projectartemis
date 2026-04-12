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
   * Creates the blog_submissions table if it doesn't exist.
   */
  initialize: async () => {
    try {
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
      console.log("MANIFESTO_SERVICE: Registry initialized.");
      return true;
    } catch (err) {
      console.error("MANIFESTO_INIT_ERROR:", err);
      return false;
    }
  },

  /**
   * 🖋️ SUBMIT MANIFESTO:
   * Records a new community submission for review.
   */
  submit: async (data: Omit<ManifestoSubmission, 'status' | 'created_at'>) => {
    try {
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
  getLiveManifestos: async (): Promise<ManifestoSubmission[]> => {
    try {
      const res = await turso.execute("SELECT * FROM blog_submissions WHERE status = 'approved' ORDER BY created_at DESC");
      return res.rows as unknown as ManifestoSubmission[];
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
