const NetflixOriginal = ({ title, original }) => {
  return (
    <div>
      <div className="inner">
        <section>
          <h2>{title}</h2>
          <ul className="list">
            {original.map((data) => (
              <li key={data.id}>
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${data.backdrop_path}`}
                    alt=""
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default NetflixOriginal;
