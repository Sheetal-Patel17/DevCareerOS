function TechnologyTags({ technologies }) {
  return (
    <div className="technology-tags">
      {technologies.map((technology) => (
        <span className="technology-tag" key={technology}>
          {technology}
        </span>
      ))}
    </div>
  );
}

export default TechnologyTags;
