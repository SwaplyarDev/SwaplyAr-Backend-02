import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module';
import { DataSource } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Iniciando seed para asignar países a providers...');

    // Buscar si existe Argentina
    const argentinaResult = await dataSource.query(
      `SELECT id FROM countries WHERE code = 'ARG' LIMIT 1`,
    );

    let countryId: string;

    if (argentinaResult.length > 0) {
      countryId = argentinaResult[0].id;
      console.log('✅ País Argentina encontrado:', countryId);
    } else {
      // Si no existe Argentina, crear una por defecto
      console.log('⚠️ Argentina no encontrada, creando...');
      const newCountry = await dataSource.query(
        `INSERT INTO countries (country_id, code, name, created_at) 
         VALUES (gen_random_uuid(), 'ARG', 'Argentina', NOW()) 
         RETURNING id`,
      );
      countryId = newCountry[0].id;
      console.log('✅ País Argentina creado:', countryId);
    }

    // Actualizar todos los providers sin país
    const updateResult = await dataSource.query(
      `UPDATE payment_providers 
       SET country_id = $1 
       WHERE country_id IS NULL
       RETURNING payment_provider_id, name, code`,
      [countryId],
    );

    console.log(`✅ ${updateResult.length} providers actualizados con país Argentina`);
    updateResult.forEach((provider: any) => {
      console.log(`   - ${provider.name} (${provider.code})`);
    });

    // Mostrar providers actualizado con su país
    const verifyResult = await dataSource.query(
      `SELECT pp.payment_provider_id, pp.name, pp.code, c.code as country_code, c.name as country_name
       FROM payment_providers pp
       LEFT JOIN countries c ON pp.country_id = c.id
       ORDER BY pp.created_at DESC`,
    );

    console.log('\n📋 Providers actualizados:');
    verifyResult.forEach((provider: any) => {
      console.log(
        `   - ${provider.name} (${provider.code}) -> ${provider.country_name} (${provider.country_code})`,
      );
    });

    console.log('\n✨ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

seed();
