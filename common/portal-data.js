(function() {
    'use strict';

    window.PORTAL_DATA = {
        "initialRegionId": "incheon",
        "regions": {
            "incheon": {
                "id": "incheon",
                "region": {
                    "ko": "인천광역시",
                    "en": ""
                },
                "label": {
                    "ko": "인천",
                    "en": ""
                },
                "summaryName": {
                    "ko": "인천 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-incheon",
                "phone": "1599-5985",
                "region-home-link": "https://www.icferry.or.kr/",
                "terminals": [{
                        "id": "incheon-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "연안여객터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "인천항",
                            "en": ""
                        },
                        "description": {
                            "ko": "서해 5도와 수도권을 잇는 섬 여행의 출발점입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "인천광역시 중구 연안부두로 70",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 21:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 기상 상황에 따라 변동",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                                "id": "baengnyeongdo",
                                "name": {
                                    "ko": "인천 → 백령도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "03:40",
                                    "en": ""
                                },
                                "frequency": {
                                    "ko": "1회",
                                    "en": ""
                                }
                            },
                            {
                                "id": "yeonpyeongdo",
                                "name": {
                                    "ko": "인천 → 연평도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "02:20",
                                    "en": ""
                                },
                                "frequency": {
                                    "ko": "2회",
                                    "en": ""
                                }
                            },
                            {
                                "id": "deokjeokdo",
                                "name": {
                                    "ko": "인천 → 덕적도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:10",
                                    "en": ""
                                },
                                "frequency": {
                                    "ko": "4회",
                                    "en": ""
                                }
                            },
                            {
                                "id": "ijakdo",
                                "name": {
                                    "ko": "인천 → 이작도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:30",
                                    "en": ""
                                },
                                "frequency": {
                                    "ko": "3회",
                                    "en": ""
                                }
                            }
                        ],
                        "folder": "incheon",
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "incheon-intl",
                        "type": "international",
                        "name": {
                            "ko": "국제여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "인천광역시 연수구 국제항만대로326번길 57",
                            "en": ""
                        },
                        "hours": {
                            "ko": "09:00 - 18:00",
                            "en": ""
                        }, // SAMPLE: 실제 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "출항 일정 및 출입국 수속 시간에 따라 변동",
                            "en": ""
                        }, // SAMPLE: 실제 운영 안내 확인 필요
                        "routes": [{
                                "id": "yantai",
                                "name": { "ko": "인천 → 옌타이", "en": "" },
                                "duration": { "ko": "14시간", "en": "" },
                                "frequency": { "ko": "주 3회", "en": "" }
                            },
                            {
                                "id": "shidao",
                                "name": { "ko": "인천 → 스다오", "en": "" },
                                "duration": { "ko": "14시간", "en": "" },
                                "frequency": { "ko": "주 3회", "en": "" }
                            },
                            {
                                "id": "weihai",
                                "name": { "ko": "인천 → 웨이하이", "en": "" },
                                "duration": { "ko": "14시간", "en": "" },
                                "frequency": { "ko": "주 3회", "en": "" }
                            },
                            {
                                "id": "qingdao",
                                "name": { "ko": "인천 → 칭다오", "en": "" },
                                "duration": { "ko": "16시간", "en": "" },
                                "frequency": { "ko": "주 3회", "en": "" }
                            },
                            {
                                "id": "lianyungang",
                                "name": { "ko": "인천 → 롄윈강", "en": "" },
                                "duration": { "ko": "24시간", "en": "" },
                                "frequency": { "ko": "주 2회", "en": "" }
                            },
                            {
                                "id": "dandong",
                                "name": { "ko": "인천 → 단둥", "en": "" },
                                "duration": { "ko": "16시간", "en": "" },
                                "frequency": { "ko": "주 2회", "en": "" }
                            }
                        ],
                        "folder": null,
                        "source": {
                            "ko": "인천항 여객터미널 공식 홈페이지",
                            "en": ""
                        }
                    }
                ]
            },
            "boryeong": {
                "id": "boryeong",
                "region": {
                    "ko": "충청남도",
                    "en": ""
                },
                "label": {
                    "ko": "대천",
                    "en": ""
                },
                "summaryName": {
                    "ko": "대천 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-boryeong",
                "phone": "1544-1114",
                "terminals": [{
                        "id": "boryeong-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "대천항여객선터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "대천항",
                            "en": ""
                        },
                        "description": {
                            "ko": "서해 섬 여행을 잇는 대천항의 연안 여객 관문입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "충청남도 보령시 대천항중앙길 30",
                            "en": ""
                        }, // TODO: 정확한 주소 확인 필요
                        "hours": {
                            "ko": "06:00 - 20:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 노선별 운영시간 상이",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                                "id": "wonsando",
                                "name": {
                                    "ko": "대천 → 원산도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "00:30",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "4회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "sapsido",
                                "name": {
                                    "ko": "대천 → 삽시도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:00",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "2회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "janggodo",
                                "name": {
                                    "ko": "대천 → 장고도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:10",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "2회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "oeyeondo",
                                "name": {
                                    "ko": "대천 → 외연도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "02:00",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "1회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            }
                        ],
                        "folder": null, // TODO: 하위 터미널 페이지 생성 후 폴더명 연결
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "boryeong-ocheon",
                        "type": "ocheon",
                        "name": {
                            "ko": "오천항여객선터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "오천항",
                            "en": ""
                        },
                        "description": {
                            "ko": "오천항과 인근 도서를 잇는 여객선 이용 거점입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "충남 보령시 오천면 오천해안로 782-13",
                            "en": ""
                        }, // SAMPLE: 정확한 주소 확인 필요
                        "hours": {
                            "ko": "06:00 - 19:00",
                            "en": ""
                        }, // SAMPLE: 실제 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 노선별 운영시간 상이",
                            "en": ""
                        }, // SAMPLE: 실제 운영 안내 확인 필요
                        "routes": [{
                                "id": "ocheon-wonsando-sample",
                                "name": { "ko": "오천 → 원산도", "en": "" },
                                "duration": { "ko": "", "en": "" },
                                "frequency": { "ko": "", "en": "" }
                            },
                            {
                                "id": "ocheon-sapsido-sample",
                                "name": { "ko": "오천 → 삽시도", "en": "" },
                                "duration": { "ko": "", "en": "" },
                                "frequency": { "ko": "", "en": "" }
                            }
                        ], // SAMPLE: 실제 운항 항로 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        }
                    }
                ]
            },
            "gunsan": {
                "id": "gunsan",
                "region": {
                    "ko": "전북특별자치도",
                    "en": ""
                },
                "label": {
                    "ko": "군산",
                    "en": ""
                },
                "summaryName": {
                    "ko": "군산 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-gunsan",
                "phone": "1544-1114",
                "terminals": [{
                    "id": "gunsan-coastal",
                    "type": "coastal",
                    "name": {
                        "ko": "군산항여객터미널",
                        "en": ""
                    },
                    "shortName": {
                        "ko": "군산항",
                        "en": ""
                    },
                    "description": {
                        "ko": "고군산군도와 서해 섬을 연결하는 군산의 해상교통 거점입니다.",
                        "en": ""
                    },
                    "address": {
                        "ko": "전북특별자치도 군산시 임해로 378-8",
                        "en": ""
                    },
                    "hours": {
                        "ko": "06:00 - 20:00",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "hoursNote": {
                        "ko": "운항일 기준 · 노선별 운영시간 상이",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "routes": [{
                            "id": "eocheongdo",
                            "name": {
                                "ko": "군산 → 어청도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "02:30",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "1회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "gaeyado",
                            "name": {
                                "ko": "군산 → 개야도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "01:00",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "2회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "seonyudo",
                            "name": {
                                "ko": "군산 → 선유도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "01:30",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "2회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }
                    ],
                    "folder": "gunsan",
                    "source": {
                        "ko": "터미널 공식 홈페이지",
                        "en": ""
                    }
                }]
            },
            "mokpo": {
                "id": "mokpo",
                "region": {
                    "ko": "전라남도",
                    "en": ""
                },
                "label": {
                    "ko": "목포",
                    "en": ""
                },
                "summaryName": {
                    "ko": "목포 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-mokpo",
                "phone": "",
                "terminals": [{
                    "id": "mokpo-coastal",
                    "type": "coastal",
                    "name": {
                        "ko": "목포연안여객선터미널",
                        "en": ""
                    },
                    "shortName": {
                        "ko": "목포항",
                        "en": ""
                    },
                    "description": {
                        "ko": "서남해 섬과 제주를 연결하는 목포의 연안 여객 관문입니다.",
                        "en": ""
                    },
                    "address": { "ko": "", "en": "" },
                    "hours": {
                        "ko": "",
                        "en": ""
                    },
                    "hoursNote": {
                        "ko": "",
                        "en": ""
                    },
                    "routes": [{
                            "id": "jeju",
                            "name": {
                                "ko": "목포 → 제주",
                                "en": ""
                            },
                            "duration": {
                                "ko": "",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "hongdo_heuksando",
                            "name": {
                                "ko": "목포 → 홍도·흑산도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "bigeum_docho",
                            "name": {
                                "ko": "목포 → 비금·도초",
                                "en": ""
                            },
                            "duration": {
                                "ko": "",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }
                    ],
                    "folder": "mokpo",
                    "source": {
                        "ko": "7월 목포항 여객선 운항 안내",
                        "en": ""
                    }
                }]
            },
            "wando": {
                "id": "wando",
                "region": {
                    "ko": "전라남도",
                    "en": ""
                },
                "label": {
                    "ko": "완도",
                    "en": ""
                },
                "summaryName": {
                    "ko": "완도 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-wando",
                "phone": "1544-1114",
                "terminals": [{
                    "id": "wando-coastal",
                    "type": "coastal",
                    "name": {
                        "ko": "완도항여객터미널",
                        "en": ""
                    },
                    "shortName": {
                        "ko": "완도항",
                        "en": ""
                    },
                    "description": {
                        "ko": "청정 다도해와 제주를 잇는 전남 서남해안의 여객 관문입니다.",
                        "en": ""
                    },
                    "address": {
                        "ko": "전라남도 완도군 완도읍 장보고대로 339",
                        "en": ""
                    },
                    "hours": {
                        "ko": "05:30 - 20:00",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "hoursNote": {
                        "ko": "운항일 기준 · 노선별 운영시간 상이",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "routes": [{
                            "id": "jeju",
                            "name": {
                                "ko": "완도 → 제주",
                                "en": ""
                            },
                            "duration": {
                                "ko": "02:40",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "3회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "cheongsando",
                            "name": {
                                "ko": "완도 → 청산도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "00:50",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "5회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "nohwado",
                            "name": {
                                "ko": "완도 → 노화도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "00:40",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "6회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }
                    ],
                    "folder": "wando",
                    "source": {
                        "ko": "터미널 공식 홈페이지",
                        "en": ""
                    }
                }]
            },
            "yeosu": {
                "id": "yeosu",
                "region": {
                    "ko": "전라남도",
                    "en": ""
                },
                "label": {
                    "ko": "여수",
                    "en": ""
                },
                "summaryName": {
                    "ko": "여수 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-yeosu",
                "phone": "1544-1114",
                "terminals": [{
                        "id": "yeosu-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "연안여객터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "여수항",
                            "en": ""
                        },
                        "description": {
                            "ko": "아름다운 다도해 섬을 연결하는 남해안의 여객 관문입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "전라남도 여수시 여객선터미널길 17",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 20:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 노선별 운영시간 상이",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                                "id": "geomundo",
                                "name": {
                                    "ko": "여수 → 거문도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "02:20",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "2회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "geumodo",
                                "name": {
                                    "ko": "여수 → 금오도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:20",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "4회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "gaedo",
                                "name": {
                                    "ko": "여수 → 개도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:10",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "3회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            }
                        ],
                        "folder": "yeosu",
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "yeosu-expo",
                        "type": "expo",
                        "name": {
                            "ko": "엑스포여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "전라남도 여수시 엑스포대로 320-66",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 20:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 운항 일정에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                            "id": "geomundo",
                            "name": { "ko": "여수엑스포 → 거문도", "en": "" },
                            "duration": { "ko": "02:00", "en": "" },
                            "frequency": { "ko": "1회", "en": "" }
                        }], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    }
                ]
            },
            "tongyeong": {
                "id": "tongyeong",
                "region": {
                    "ko": "경상남도",
                    "en": ""
                },
                "label": {
                    "ko": "통영",
                    "en": ""
                },
                "summaryName": {
                    "ko": "통영 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-tongyeong",
                "phone": "1544-1114",
                "terminals": [{
                    "id": "tongyeong-coastal",
                    "type": "coastal",
                    "name": {
                        "ko": "통영항여객터미널",
                        "en": ""
                    },
                    "shortName": {
                        "ko": "통영항",
                        "en": ""
                    },
                    "description": {
                        "ko": "한려수도의 여러 섬으로 향하는 통영의 대표 여객터미널입니다.",
                        "en": ""
                    },
                    "address": {
                        "ko": "경상남도 통영시 통영해안로 234",
                        "en": ""
                    },
                    "hours": {
                        "ko": "06:00 - 20:00",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "hoursNote": {
                        "ko": "운항일 기준 · 노선별 운영시간 상이",
                        "en": ""
                    }, // SAMPLE: 실제 값 확인 필요
                    "routes": [{
                            "id": "yokjido",
                            "name": {
                                "ko": "통영 → 욕지도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "01:30",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "4회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "hansando",
                            "name": {
                                "ko": "통영 → 한산도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "00:50",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "6회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "saryangdo",
                            "name": {
                                "ko": "통영 → 사량도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "01:20",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "4회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }
                    ],
                    "folder": "tongyeong",
                    "source": {
                        "ko": "터미널 공식 홈페이지",
                        "en": ""
                    }
                }]
            },
            "busan": {
                "id": "busan",
                "region": {
                    "ko": "부산광역시",
                    "en": ""
                },
                "label": {
                    "ko": "부산",
                    "en": ""
                },
                "summaryName": {
                    "ko": "부산 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-busan",
                "phone": "1544-1114",
                "terminals": [{
                        "id": "busan-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "연안여객터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "부산항",
                            "en": ""
                        },
                        "description": {
                            "ko": "부산과 제주를 잇는 연안 여객선 이용 거점입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "부산광역시 중구 충장대로 24",
                            "en": ""
                        }, // TODO: 정확한 주소 확인 필요
                        "hours": {
                            "ko": "06:00 - 20:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 노선별 운영시간 상이",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                            "id": "jeju",
                            "name": {
                                "ko": "부산 → 제주",
                                "en": ""
                            },
                            "duration": {
                                "ko": "11:30",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "1회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }],
                        "folder": null, // TODO: 하위 터미널 페이지 생성 후 폴더명 연결
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "busan-international",
                        "type": "international",
                        "name": {
                            "ko": "국제여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "부산광역시 동구 충장대로 206",
                            "en": ""
                        }, // TODO: 정확한 주소 확인 필요
                        "hours": {
                            "ko": "06:00 - 22:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "국제선 운항일 기준 · 출입국 일정에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                                "id": "tsushima",
                                "name": { "ko": "부산 → 대마도", "en": "" },
                                "duration": { "ko": "01:30", "en": "" },
                                "frequency": { "ko": "2회", "en": "" }
                            },
                            {
                                "id": "fukuoka",
                                "name": { "ko": "부산 → 후쿠오카", "en": "" },
                                "duration": { "ko": "06:00", "en": "" },
                                "frequency": { "ko": "1회", "en": "" }
                            }
                        ], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    },
                    {
                        "id": "busan-yeongdo-cruise",
                        "type": "yeongdoCruise",
                        "name": {
                            "ko": "영도 크루즈터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "부산광역시 영도구 해양로301번길 17",
                            "en": ""
                        },
                        "hours": {
                            "ko": "08:00 - 18:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "크루즈 입항일 기준 · 일정에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                            "id": "cruise-port",
                            "name": { "ko": "영도 → 크루즈 기항지", "en": "" },
                            "duration": { "ko": "일정별 상이", "en": "" },
                            "frequency": { "ko": "일정별 상이", "en": "" }
                        }], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    }
                ]
            },
            "donghae": {
                "id": "donghae",
                "region": {
                    "ko": "강원특별자치도",
                    "en": ""
                },
                "label": {
                    "ko": "동해",
                    "en": ""
                },
                "summaryName": {
                    "ko": "동해 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-donghae",
                "phone": "033-521-0661",
                "terminals": [{
                    "id": "donghae-international",
                    "type": "international",
                    "name": {
                        "ko": "동해항 국제여객터미널",
                        "en": ""
                    },
                    "shortName": {
                        "ko": "동해항",
                        "en": ""
                    },
                    "description": {
                        "ko": "일본과 러시아를 잇는 환동해 국제 카페리의 출발점입니다.",
                        "en": ""
                    },
                    "address": {
                        "ko": "강원특별자치도 동해시 대동로 210",
                        "en": ""
                    },
                    "hours": {
                        "ko": "09:00 - 18:00",
                        "en": ""
                    }, // SAMPLE: 실제 운영시간 확인 필요
                    "hoursNote": {
                        "ko": "운항일 기준 · 출항 일정에 따라 변동",
                        "en": ""
                    }, // SAMPLE: 실제 운영시간 보조 문구 확인 필요
                    "routes": [{
                            "id": "sakaiminato",
                            "name": {
                                "ko": "동해 → 사카이미나토",
                                "en": ""
                            },
                            "duration": {
                                "ko": "",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        },
                        {
                            "id": "vladivostok",
                            "name": {
                                "ko": "동해 → 블라디보스토크",
                                "en": ""
                            },
                            "duration": {
                                "ko": "",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }
                    ],
                    "folder": null,
                    "source": {
                        "ko": "두원상선 공식 홈페이지",
                        "en": ""
                    }
                }]
            },
            "pohang": {
                "id": "pohang",
                "region": {
                    "ko": "경상북도",
                    "en": ""
                },
                "label": {
                    "ko": "포항",
                    "en": ""
                },
                "summaryName": {
                    "ko": "포항 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-pohang",
                "phone": "1544-1114",
                "terminals": [{
                        "id": "pohang-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "포항여객터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "포항항",
                            "en": ""
                        },
                        "description": {
                            "ko": "동해와 울릉도를 연결하는 경북 동해안의 바닷길 관문입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "경상북도 포항시 북구 해안로 44",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 21:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 기상 상황에 따라 변동",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                            "id": "ulleungdo",
                            "name": {
                                "ko": "포항 → 울릉도",
                                "en": ""
                            },
                            "duration": {
                                "ko": "03:30",
                                "en": ""
                            }, // TODO: 실제 소요시간 확인 필요
                            "frequency": {
                                "ko": "2회",
                                "en": ""
                            } // TODO: 실제 운항횟수 확인 필요
                        }],
                        "folder": "pohang",
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "pohang-ulleung-dodong",
                        "type": "ulleungDodong",
                        "name": {
                            "ko": "울릉(도동) 여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "경상북도 울릉군 울릉읍 도동길 14",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 19:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 기상 상황에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                            "id": "pohang",
                            "name": { "ko": "도동 → 포항", "en": "" },
                            "duration": { "ko": "03:30", "en": "" },
                            "frequency": { "ko": "1회", "en": "" }
                        }], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    },
                    {
                        "id": "pohang-ulleung-sadong",
                        "type": "ulleungSadong",
                        "name": {
                            "ko": "울릉(사동) 여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "경상북도 울릉군 울릉읍 사동리 946",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 19:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 기상 상황에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                                "id": "pohang",
                                "name": { "ko": "사동 → 포항", "en": "" },
                                "duration": { "ko": "03:30", "en": "" },
                                "frequency": { "ko": "2회", "en": "" }
                            },
                            {
                                "id": "hupo",
                                "name": { "ko": "사동 → 후포", "en": "" },
                                "duration": { "ko": "02:30", "en": "" },
                                "frequency": { "ko": "1회", "en": "" }
                            }
                        ], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    },
                    {
                        "id": "pohang-ulleung-jeodong",
                        "type": "ulleungJeodong",
                        "name": {
                            "ko": "울릉(저동) 여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "경상북도 울릉군 울릉읍 울릉순환로 171",
                            "en": ""
                        },
                        "hours": {
                            "ko": "06:00 - 19:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 기상 상황에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                            "id": "mukho",
                            "name": { "ko": "저동 → 묵호", "en": "" },
                            "duration": { "ko": "03:00", "en": "" },
                            "frequency": { "ko": "1회", "en": "" }
                        }], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    }
                ]
            },
            "jeju": {
                "id": "jeju",
                "region": {
                    "ko": "제주특별자치도",
                    "en": ""
                },
                "label": {
                    "ko": "제주",
                    "en": ""
                },
                "summaryName": {
                    "ko": "제주 여객선 터미널",
                    "en": ""
                },
                "cssPos": "marker-jeju",
                "phone": "1544-1114",
                "terminals": [{
                        "id": "jeju-coastal",
                        "type": "coastal",
                        "name": {
                            "ko": "연안여객터미널",
                            "en": ""
                        },
                        "shortName": {
                            "ko": "제주항",
                            "en": ""
                        },
                        "description": {
                            "ko": "제주와 육지를 연결하는 대표적인 해상교통 관문입니다.",
                            "en": ""
                        },
                        "address": {
                            "ko": "제주특별자치도 제주시 임항로 111",
                            "en": ""
                        },
                        "hours": {
                            "ko": "05:30 - 21:00",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "hoursNote": {
                            "ko": "매일 운영 · 운항 일정에 따라 변동",
                            "en": ""
                        }, // SAMPLE: 실제 값 확인 필요
                        "routes": [{
                                "id": "mokpo",
                                "name": {
                                    "ko": "제주 → 목포",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "04:30",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "2회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "wando",
                                "name": {
                                    "ko": "제주 → 완도",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "02:40",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "4회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "chuja",
                                "name": {
                                    "ko": "제주 → 추자",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "01:00",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "4회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            },
                            {
                                "id": "nokdong",
                                "name": {
                                    "ko": "제주 → 녹동",
                                    "en": ""
                                },
                                "duration": {
                                    "ko": "03:40",
                                    "en": ""
                                }, // TODO: 실제 소요시간 확인 필요
                                "frequency": {
                                    "ko": "1회",
                                    "en": ""
                                } // TODO: 실제 운항횟수 확인 필요
                            }
                        ],
                        "folder": "jeju",
                        "source": {
                            "ko": "터미널 공식 홈페이지",
                            "en": ""
                        }
                    },
                    {
                        "id": "jeju-intl",
                        "type": "international",
                        "name": {
                            "ko": "국제여객터미널",
                            "en": ""
                        },
                        "address": {
                            "ko": "제주특별자치도 제주시 임항로 191",
                            "en": ""
                        },
                        "hours": {
                            "ko": "05:30 - 21:00",
                            "en": ""
                        }, // TODO: 운영시간 확인 필요
                        "hoursNote": {
                            "ko": "운항일 기준 · 선사 일정에 따라 변동",
                            "en": ""
                        }, // TODO: 운영시간 보조 문구 확인 필요
                        "routes": [{
                                "id": "wando",
                                "name": { "ko": "제주 → 완도", "en": "" },
                                "duration": { "ko": "02:40", "en": "" },
                                "frequency": { "ko": "2회", "en": "" }
                            },
                            {
                                "id": "mokpo",
                                "name": { "ko": "제주 → 목포", "en": "" },
                                "duration": { "ko": "04:30", "en": "" },
                                "frequency": { "ko": "1회", "en": "" }
                            }
                        ], // SAMPLE: 실제 항로·소요시간·운항횟수 확인 필요
                        "folder": null,
                        "source": {
                            "ko": "샘플 데이터 · 실제 정보 확인 필요",
                            "en": ""
                        } // TODO: 출처 확인 필요
                    }
                ]
            }
        }
    };

    // TODO: 아래 터미널은 지도 확대 마커 연결용 기본 데이터입니다.
    // 주소·항로·운영시간은 공식 정보 확인 후 채워야 합니다.
    function createPendingPortalTerminal(id, type, name, sampleRouteNames) {
        return {
            id,
            type,
            name: { ko: name, en: '' },
            address: { ko: '', en: '' },
            hours: { ko: '', en: '' },
            hoursNote: { ko: '상세 운영 정보 준비 중', en: '' },
            routes: sampleRouteNames.map((routeName, index) => ({
                id: `${id}-route-${index + 1}-sample`,
                name: { ko: routeName, en: '' },
                duration: { ko: '', en: '' },
                frequency: { ko: '', en: '' }
            })), // SAMPLE: 실제 운항 항로 확인 필요
            folder: null,
            source: { ko: '', en: '' }
        };
    }

    const supplementalTerminals = {
        boryeong: [
            Object.assign(
                createPendingPortalTerminal('boryeong-international', 'international', '대천항 국제여객터미널', ['대천 → 국제 크루즈 기항지']), { address: { ko: '충청남도 보령시 대천항중앙길 30', en: '' } }
            )
        ],
        gunsan: [
            Object.assign(
                createPendingPortalTerminal('gunsan-international', 'international', '군산항 국제여객터미널', ['군산 → 스다오']), { address: { ko: '전북특별자치도 군산시 임해로 378-14', en: '' } }
            )
        ],
        mokpo: [
            Object.assign(
                createPendingPortalTerminal('mokpo-international', 'international', '목포항 국제여객터미널', ['목포 → 국제 크루즈 기항지']), { address: { ko: '전라남도 목포시 해안로148번길 14', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('mokpo-heuksando', 'heuksando', '흑산도항여객터미널', ['흑산도 → 홍도', '흑산도 → 가거도']), { address: { ko: '전라남도 신안군 흑산면 예리1길 41-19', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('mokpo-hongdo', 'hongdo', '홍도항여객터미널', ['홍도 → 흑산도', '홍도 → 목포']), { address: { ko: '전라남도 신안군 흑산면 홍도1길 65-2', en: '' } }
            )
        ],
        wando: [
            Object.assign(
                createPendingPortalTerminal('wando-international', 'international', '완도항 국제여객터미널', ['완도 → 국제 크루즈 기항지']), { address: { ko: '전라남도 완도군 완도읍 장보고대로 339', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('wando-jindo', 'jindo', '진도항여객선터미널', ['진도 → 제주', '진도 → 추자도']), { address: { ko: '전라남도 진도군 임회면 진도항길 101', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('wando-ttangkkeut', 'ttangkkeut', '땅끝항여객선터미널', ['땅끝 → 보길도', '땅끝 → 노화도']), { address: { ko: '전라남도 해남군 송지면 땅끝마을길 42', en: '' } }
            )
        ],
        jeju: [
            Object.assign(
                createPendingPortalTerminal('jeju-seogwipo', 'seogwipo', '운진항여객터미널', ['운진항 → 마라도', '운진항 → 가파도']), { address: { ko: '제주특별자치도 서귀포시 대정읍 최남단해안로 120', en: '' } }
            )
        ],
        yeosu: [
            Object.assign(
                createPendingPortalTerminal('yeosu-international', 'international', '여수항 국제여객터미널', ['여수 → 국제 크루즈 기항지']), { address: { ko: '전라남도 여수시 엑스포대로 320-66', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('yeosu-nokdong', 'nokdong', '녹동신항여객선터미널', ['녹동 → 제주', '녹동 → 거문도']), { address: { ko: '전라남도 고흥군 도양읍 비봉로 266-16', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('yeosu-narodo', 'narodo', '나로도항여객선터미널', ['나로도 → 거문도', '나로도 → 손죽도']), { address: { ko: '전라남도 고흥군 봉래면 나로도항길 120-7', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('yeosu-geomundo', 'geomundo', '거문도항여객선터미널', ['거문도 → 여수', '거문도 → 녹동']), { address: { ko: '전라남도 여수시 삼산면 거문길 103', en: '' } }
            )
        ],
        tongyeong: [
            Object.assign(
                createPendingPortalTerminal('tongyeong-international', 'international', '통영항 국제여객터미널', ['통영 → 국제 크루즈 기항지']), { address: { ko: '경상남도 통영시 통영해안로 234', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('tongyeong-samcheonpo', 'samcheonpo', '삼천포신항여객터미널', ['삼천포 → 제주', '삼천포 → 사량도']), { address: { ko: '경상남도 사천시 신항로 18', en: '' } }
            )
        ],
        pohang: [
            Object.assign(
                createPendingPortalTerminal('pohang-international', 'international', '포항항 국제여객터미널', ['포항 → 국제 크루즈 기항지']), { address: { ko: '경상북도 포항시 북구 흥해읍 영일만항로 285-2', en: '' } }
            )
        ],
        donghae: [
            Object.assign(
                createPendingPortalTerminal('donghae-sokcho', 'sokcho', '속초항여객터미널', ['속초 → 울릉도', '속초 → 국제 크루즈 기항지']), { address: { ko: '강원특별자치도 속초시 설악금강대교로 230', en: '' } }
            ),
            Object.assign(
                createPendingPortalTerminal('donghae-mukho', 'coastal', '묵호항여객선터미널', ['묵호 → 울릉도', '묵호 → 독도']), { address: { ko: '강원특별자치도 동해시 일출로 22', en: '' } }
            )
        ]
    };

    Object.entries(supplementalTerminals).forEach(([regionId, terminals]) => {
        const region = window.PORTAL_DATA.regions[regionId];
        if (!region) return;
        terminals.forEach((terminal) => {
            if (!region.terminals.some((item) => item.id === terminal.id)) region.terminals.push(terminal);
        });
    });

    const regionalOperators = {
        incheon: [
            { name: { ko: '고려고속훼리', en: '' }, url: 'https://www.kefship.com/' },
            { name: { ko: '대부해운', en: '' }, url: 'https://www.daebuhw.com/' }
        ],
        boryeong: [
            { name: { ko: '신한해운', en: '' }, url: 'https://www.shinhanhewoon.com/' }
        ],
        gunsan: [
            { name: { ko: '석도국제훼리', en: '' }, url: 'http://www.shidaoferry.com/' }
        ],
        mokpo: [
            { name: { ko: '씨월드고속훼리', en: '' }, url: 'https://seaferry.co.kr/' }
        ],
        wando: [
            { name: { ko: '한일고속', en: '' }, url: 'https://www.hanilexpress.co.kr/' }
        ],
        yeosu: [
            { name: { ko: '한일고속', en: '' }, url: 'https://www.hanilexpress.co.kr/' }
        ],
        tongyeong: [
            { name: { ko: '통영항 운항선사 조회', en: '' }, url: 'https://island.theksa.co.kr/' }
        ],
        busan: [
            { name: { ko: '엠에스페리', en: '' }, url: 'https://msferry.co.kr/' }
        ],
        donghae: [
            { name: { ko: '두원상선', en: '' }, url: 'https://www.dwship.co.kr/' }
        ],
        pohang: [
            { name: { ko: '대저페리', en: '' }, url: 'https://www.daezer.com/' },
            { name: { ko: '울릉크루즈', en: '' }, url: 'https://www.ulcruise.co.kr/' }
        ],
        jeju: [
            { name: { ko: '씨월드고속훼리', en: '' }, url: 'https://seaferry.co.kr/' },
            { name: { ko: '한일고속', en: '' }, url: 'https://www.hanilexpress.co.kr/' }
        ]
    };

    Object.entries(regionalOperators).forEach(([regionId, operators]) => {
        const region = window.PORTAL_DATA.regions[regionId];
        if (region) region.operators = operators;
    });
    const pohangTerminalTypeOrder = [
        'coastal',
        'international',
        'ulleungDodong',
        'ulleungSadong',
        'ulleungJeodong'
    ];
    const pohangRegion = window.PORTAL_DATA.regions.pohang;
    if (pohangRegion) {
        pohangRegion.terminals.sort((a, b) => (
            pohangTerminalTypeOrder.indexOf(a.type) - pohangTerminalTypeOrder.indexOf(b.type)
        ));
    }
}());
