function Members({ members, me }) {
  console.log(members);
  return (
    <div className="members">
      <div>
        {members.length} user{members.length === 1 ? "" : "s"} online
      </div>
      <ul>
        {members.map((member) => (
          <Member
            member={member}
            thisIsMe={member.id === me.id}
            key={member.id}
          />
        ))}
      </ul>
    </div>
  );

  function Member({ member, thisIsMe }) {
    console.log(member);

    const { username, color } = member.clientData;
    return (
      <li>
        <div style={{ backgroundColor: color }}></div>

        <span style={{ color: color }}>
          {username} {thisIsMe ? " (you)" : ""}
        </span>
      </li>
    );
  }
}

export default Members;
