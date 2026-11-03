export default function LiveLeaderboard({ rows = [], ownId }) {
  return <section className="panel results-panel"><div className="section-heading"><h2>Leaderboard</h2></div>
    {!rows.length ? <p className="muted">No participants yet. Share the room code to invite them.</p> : <div className="table-scroll"><table><thead><tr><th>Rank</th><th>Participant</th><th>Score</th><th>Correct</th></tr></thead><tbody>
      {rows.map(row => <tr key={row.participantId} className={row.participantId === ownId ? "live-own-row" : ""}><td>{row.rank}</td><td>{row.displayName}{row.participantId === ownId && " (you)"}</td><td><span className="score-pill">{row.score}</span></td><td>{row.correctAnswers}</td></tr>)}
    </tbody></table></div>}
    <p className="muted small table-note">1 point for each correct answer. Scores update when each question closes. Equal scores share a rank.</p>
  </section>;
}
