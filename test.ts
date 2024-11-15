const main = async () => {
  console.log(
    await Bun.password.verify(
      "test",
      "$argon2id$v=19$m=65536,t=2,p=1$woBLLd++VZ0zrlyDE4CBKMJ1LDpv4WyfjQpwVFvPbjA$D6OCcE8uVMc+nuv2QG7ZB4cB9HXzuE/Ezag98nM6Zks"
    )
  );
  console.log(
    await Bun.password.verify(
      "test",
      "$argon2id$v=19$m=65536,t=2,p=1$iE+/dL8vhXtjetQXHHInULUMajQr0HQb9m6V9DYdJXk$KeHL7kgCoa8buymH5lVaeS/lcOSA2stSNTz+AZJbcS8"
    )
  );
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
