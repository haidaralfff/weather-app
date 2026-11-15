import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isRainSlot, normalizeBmkgPayload } from '../src/services/bmkgWeather.js'

describe('isRainSlot', () => {
  it('tidak menandai Cerah atau Berawan sebagai hujan meski tp > 0', () => {
    assert.equal(
      isRainSlot({ weather: 1, weather_desc: 'Cerah', tp: 0.2 }),
      false,
    )
    assert.equal(
      isRainSlot({ weather: 2, weather_desc: 'Cerah Berawan', tp: 0.6 }),
      false,
    )
    assert.equal(
      isRainSlot({ weather: 3, weather_desc: 'Berawan', tp: 0.9 }),
      false,
    )
  })

  it('menandai slot hujan atau petir dari deskripsi atau kode WMO >= 60', () => {
    assert.equal(
      isRainSlot({ weather: 61, weather_desc: 'Hujan Ringan', tp: 1.6 }),
      true,
    )
    assert.equal(
      isRainSlot({ weather: 95, weather_desc: 'Hujan Petir', tp: 5.4 }),
      true,
    )
    assert.equal(
      isRainSlot({ weather: 0, weather_desc: 'Hujan Sedang', tp: 0 }),
      true,
    )
  })
})

describe('normalizeBmkgPayload', () => {
  it('mengelompokkan 3 hari dan menghitung status hujan beserta jamnya', () => {
    const sample = {
      lokasi: {
        adm4: '33.05.12.1024',
        desa: 'Kebumen',
        kecamatan: 'Kebumen',
        kotkab: 'Kebumen',
        provinsi: 'Jawa Tengah',
      },
      data: [
        {
          cuaca: [
            [
              {
                local_datetime: '2026-11-15 21:00:00',
                weather: 3,
                weather_desc: 'Berawan',
                t: 25,
                hu: 95,
                ws: 3,
                wd: 'NW',
                tcc: 80,
                tp: 0.1,
                analysis_date: '2026-11-15T12:00:00',
              },
            ],
            [
              {
                local_datetime: '2026-11-16 09:00:00',
                weather: 1,
                weather_desc: 'Cerah',
                t: 29,
                hu: 74,
                ws: 6.9,
                wd: 'S',
                tcc: 50,
                tp: 0.2,
                analysis_date: '2026-11-15T12:00:00',
              },
              {
                local_datetime: '2026-11-16 15:00:00',
                weather: 61,
                weather_desc: 'Hujan Ringan',
                t: 27,
                hu: 89,
                ws: 5.9,
                wd: 'SE',
                tcc: 99,
                tp: 1.6,
                analysis_date: '2026-11-15T12:00:00',
              },
            ],
          ],
        },
      ],
    }

    const now = new Date('2026-11-15T21:00:00+07:00')
    const result = normalizeBmkgPayload(sample, now)

    assert.equal(result.location.adm4, '33.05.12.1024')
    assert.equal(result.days.length, 2)
    assert.equal(result.days[0].title, 'Hari Ini')
    assert.equal(result.days[0].willRain, false)
    assert.equal(result.days[1].title, 'Besok')
    assert.equal(result.days[1].willRain, true)
    assert.deepEqual(
      result.days[1].rainSlots.map((s) => s.timeLabel),
      ['15:00'],
    )
    assert.equal(result.days[1].tempMin, 27)
    assert.equal(result.days[1].tempMax, 29)
  })
})
