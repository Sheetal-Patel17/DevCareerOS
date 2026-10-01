function SkillLevelBadge({ level }) {
  return (
    <span className={`skill-level skill-level-${level.toLowerCase()}`}>
      {level}
    </span>
  );
}

export default SkillLevelBadge;
